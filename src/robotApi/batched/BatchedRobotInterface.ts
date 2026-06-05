import { AnswerPredictionRequest } from "../AnswerPredictionRequest";
import { AnswerPredictionResponse } from "../AnswerPredictionResponse";
import { EvidenceExtractionRequest } from "../EvidenceExtractionRequest";
import { EvidenceExtractionResponse } from "../EvidenceExtractionResponse";
import { RobotInterface } from "../RobotInterface";
import { AnswerPredictionBatchRequest } from "./AnswerPredictionBatchRequest";
import { EvidenceExtractionBatchRequest } from "./EvidenceExtractionBatchRequest";

/**
 * Base class for an NLP robot that supports batching of queries.
 * It automatically accumulates requests from the DocMarker into
 * batches and then provides them for you to send them to your
 * API server in bulk.
 */
export abstract class BatchedRobotInterface implements RobotInterface {
  /**
   * Maximum number of fields to be sent to the robot in parallel
   * by the DocMarker application. Controls concurrency on the INPUT
   * to the batching logic, not the output.
   */
  abstract get maxFieldRequestConcurrency(): number;

  /**
   * How many requests to aggregate together into batch (at most)
   */
  abstract get batchSize(): number;

  /**
   * How many milliseconds to wait maximum for requests, before
   * submitting the accumulated requests as a batch even if there's
   * fewer of them than the specified batch size.
   */
  abstract get batchingTimeoutMs(): number;

  private evidenceRequestQueue = new BatchingQueue<
    EvidenceExtractionRequest,
    EvidenceExtractionResponse
  >(
    () => this.batchingTimeoutMs,
    () => this.batchSize,
    (
      requests: EvidenceExtractionRequest[],
      abortSignal: AbortSignal,
    ): Promise<EvidenceExtractionResponse[] | null> => {
      assertAllEqual(requests.map((r) => r.reportText));
      assertAllEqual(requests.map((r) => r.reportLanguage));
      assertAllEqual(requests.map((r) => r.formId));
      return this.extractEvidencesBatched(
        {
          reportText: requests[0].reportText,
          reportLanguage: requests[0].reportLanguage,
          formId: requests[0].formId,
          fieldIds: requests.map((r) => r.fieldId),
        },
        abortSignal,
      );
    },
  );

  private answerRequestQueue = new BatchingQueue<
    AnswerPredictionRequest,
    AnswerPredictionResponse
  >(
    () => this.batchingTimeoutMs,
    () => this.batchSize,
    (
      requests: AnswerPredictionRequest[],
      abortSignal: AbortSignal,
    ): Promise<AnswerPredictionResponse[] | null> => {
      assertAllEqual(requests.map((r) => r.reportLanguage));
      assertAllEqual(requests.map((r) => r.formId));
      return this.predictAnswerBatched(
        {
          reportLanguage: requests[0].reportLanguage,
          formId: requests[0].formId,
          questions: requests.map((r) => ({
            fieldId: r.fieldId,
            evidences: r.evidences,
          })),
        },
        abortSignal,
      );
    },
  );

  /**
   * Extracts a list of evidences for a single form field (a single question)
   * Aborting should not throw, instead, null should be returned.
   */
  public extractEvidences(
    request: EvidenceExtractionRequest,
    abortSignal: AbortSignal,
  ): Promise<EvidenceExtractionResponse | null> {
    return this.evidenceRequestQueue.enqueue(request, abortSignal);
  }

  /**
   * Attempts to predict an anwer for a form field (a question) given
   * the set of previously-extracted (or human-provided) evidences.
   * Aborting should not throw, instead, null should be returned.
   */
  public predictAnswer(
    request: AnswerPredictionRequest,
    abortSignal: AbortSignal,
  ): Promise<AnswerPredictionResponse | null> {
    return this.answerRequestQueue.enqueue(request, abortSignal);
  }

  /**
   * Batched variant of evidence extraction, called automatically
   * by the BatchedRobotInterface when a batch is to be submitted.
   * Aborting should not throw, instead, null should be returned.
   */
  protected abstract extractEvidencesBatched(
    batchRequest: EvidenceExtractionBatchRequest,
    abortSignal: AbortSignal,
  ): Promise<EvidenceExtractionResponse[] | null>;

  /**
   * Batched variant of answer prediction, called automatically
   * by the BatchedRobotInterface when a batch is to be submitted.
   * Aborting should not throw, instead, null should be returned.
   */
  protected abstract predictAnswerBatched(
    batchRequest: AnswerPredictionBatchRequest,
    abortSignal: AbortSignal,
  ): Promise<AnswerPredictionResponse[] | null>;
}

/**
 * A queue of requests that are bacthed when batch size
 * is reached or when a timer ticks. The timer is reset
 * with each insertion into the queue. Alongside requests,
 * it also tracks their resolution promises.
 *
 * Note that the queue does not handle abort signals by itself,
 * instead it forwards them to the consumer and only aggreagates
 * their signals. This is to keep this logic simpler, while having
 * minimal impact on the behaviour.
 */
class BatchingQueue<TRequest, TResponse> {
  private readonly timeoutGetter: () => number;
  private readonly batchSizeGetter: () => number;
  private readonly emitter: (
    requests: TRequest[],
    abortSignal: AbortSignal,
  ) => Promise<TResponse[] | null>;

  /**
   * The queue of items which is batched whenever a size
   * is reached or the timer ticks. Inserts are at position 0
   * and removals happen from the end via the pop method.
   */
  private readonly queue: QueueItem<TRequest, TResponse>[] = [];

  /**
   * Null if no timer set, otherwise this is the handle
   * to the latest scheduled timer tick
   */
  private timerHandle: NodeJS.Timeout | null = null;

  constructor(
    timeoutGetter: () => number,
    batchSizeGetter: () => number,
    emitter: (
      requests: TRequest[],
      abortSignal: AbortSignal,
    ) => Promise<TResponse[] | null>,
  ) {
    this.timeoutGetter = timeoutGetter;
    this.batchSizeGetter = batchSizeGetter;
    this.emitter = emitter;
  }

  /**
   * Adds a new request into the queue. A batch is emitted if the
   * queue length exceeds one batch size. Regardless of that, a timer
   * is set up, which will emit a batch within a given timeout if no
   * more requests enter the queue before it fires.
   */
  public enqueue(
    request: TRequest,
    abortSignal: AbortSignal,
  ): Promise<TResponse | null> {
    return new Promise<TResponse | null>((resolve, reject) => {
      const item: QueueItem<TRequest, TResponse> = {
        request: request,
        abortSignal: abortSignal,
        resolvePromise: resolve,
        rejectPromise: reject,
      };

      // insert at 0 position
      this.queue.splice(0, 0, item);

      // emit all batches that can be emitted
      while (this.tryEmitFullBatch());

      // reset timer to eventually flush any leftover requests
      // (even if none are left, resetting the timer is ok)
      this.resetTimer();
    });
  }

  /**
   * Tries to emit a full batch of requests.
   * If there aren't enough requests, does nothing and returns false.
   * Does not care about the abort signals of those requests.
   */
  private tryEmitFullBatch(): boolean {
    const batchSize = this.batchSizeGetter();

    // if there aren't enough requests in the queue, do nothing
    if (this.queue.length < batchSize) {
      return false;
    }

    // pluck requests out of the end of the queue
    const items = this.queue.splice(this.queue.length - batchSize, batchSize);

    // and emit them as a batch
    this.emitBatch(items);

    return true;
  }

  /**
   * Takes all remaining requests in the queue and emits them as a batch.
   * If there are more remaining requests than the batch size,
   * more than one batch will be emitted, until they are all flushed.
   */
  private emitRemainingRequestsAsBatch(): void {
    // Reduce requests in the queue to below the batch size.
    // This should do nothing if this method was invoked at the
    // proper moment, but is present for defensive reasons.
    while (this.tryEmitFullBatch());

    // if there are no requests in the queue, do nothing
    if (this.queue.length === 0) {
      return;
    }

    // pluck requests out of the queue
    const items = this.queue.splice(0, this.queue.length);

    // and emit them as a batch
    this.emitBatch(items);
  }

  /**
   * Emits queue items as a batch. Given items should have
   * already been removed from the queue and their count
   * should be below the desired batch size. This method does
   * not touch the queue and does not perform batching. Only emission.
   */
  private emitBatch(items: QueueItem<TRequest, TResponse>[]): void {
    if (items.length === 0) {
      throw new Error("Cannot emit a 0-sized batch.");
    }

    const requests = items.map((item) => item.request);
    const abortSignal = composeAbortSignals(
      items.map((item) => item.abortSignal),
    );

    // emit a batch and immediately register its completion and error handlers
    this.emitter(requests, abortSignal)
      .then((batchResponse: TResponse[] | null) => {
        if (batchResponse === null) {
          // batch was aborted, so reutrn null for all requests,
          // which corresponds to each individual being aborted
          items.forEach((item) => item.resolvePromise(null));
        } else {
          // distribute responses to requests
          for (let i = 0; i < batchResponse.length; i++) {
            items[i].resolvePromise(batchResponse[i]);
          }
        }
      })
      .catch((error: any) => {
        // spread error to all requests
        items.forEach((item) => item.rejectPromise(error));
      });
  }

  /**
   * Called when the timer fires
   */
  private onTimerTick(): void {
    this.timerHandle = null;

    // Right now, there should be less than the batch size of items
    // in the queue. If more would be added, the batch would have been
    // emitted in the enqueue method. The queue may also be empty.

    // Emit whatewer is in the queue. If empty, does nothing. If more
    // than one batch worth of requests, it will emit multiple batches
    // (which should not happen, but just in case...)
    this.emitRemainingRequestsAsBatch();

    // The queue is definitely empty now.

    // And now, do nothing. Do not reset the timer, that will be done
    // when new request gets enqueued.
  }

  /**
   * Resets and re-schedules the timer
   */
  private resetTimer(): void {
    // cancel running timer (if running)
    if (this.timerHandle !== null) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }

    // schedule a tick
    this.timerHandle = setTimeout(
      this.onTimerTick.bind(this),
      this.timeoutGetter(),
    );
  }
}

interface QueueItem<TRequest, TResponse> {
  readonly request: TRequest;
  readonly abortSignal: AbortSignal;
  readonly resolvePromise: (response: TResponse | null) => void;
  readonly rejectPromise: (reason: any) => void;
}

/**
 * Creates a composed abort signal that aborts whenever
 * any one of the given abort signals aborts.
 */
function composeAbortSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  signals.forEach((signal) => {
    signal.addEventListener("abort", () => controller.abort(signal.reason));
  });

  return controller.signal;
}

/**
 * Checkes that all provided values are equal and throws an error if not
 */
function assertAllEqual(values: any[]): void {
  if (values.length === 0) {
    return; // condition is satisfied for empty list
  }

  const target = values[0];
  for (let value of values) {
    if (value !== target) {
      throw new Error(
        "Batching robot interface requires incomming requests to " +
          "have identical metadata, such as the report text, language, " +
          "etc. This condition is not fulfilled. See the stack trace " +
          "to learn which field is diverging between requests.",
      );
    }
  }
}
