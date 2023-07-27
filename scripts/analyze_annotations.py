import json
import re
import argparse


parser = argparse.ArgumentParser(
    description="Lists"
)
parser.add_argument("filename")
parser.add_argument("-c", "--no-colors", action="store_true")
args = parser.parse_args()


COLOR = {
    "reset": "\033[0m",
    "path": "\033[95m",
    "unicode": "\033[35m",
    "range": "\033[33m",
    "arrow": "\033[35m"
}

if args.no_colors:
    for k in COLOR.keys():
        COLOR[k] = ""


def resolve_json_path(path, data):
    if len(path) == 0:
        return json.dumps(data)
    else:
        if path[0] not in data:
            return "undefined"
        else:
            return resolve_json_path(path[1:], data[path[0]])


########
# MAIN #
########

with open(args.filename, "r") as f:
  file = json.load(f)

reportText = file["_reportText"]
formData = file["_formData"]

for path, highlights in sorted(file["_highlights"].items(), key=lambda x: x[0]):
    ranges = []
    json_strings = []
    plain_strings = []
    
    for highlight in highlights:
        index = highlight["index"]
        length = highlight["length"]
        start = index
        end = start + length

        ranges.append((start, end))
        
        plain_string = reportText[start:end]
        plain_strings.append(plain_string)

        json_string = json.dumps(plain_string)
        json_string = re.sub(
            '(\\\\u.{4})',
            COLOR["unicode"] + "\\1" + COLOR["reset"],
            json_string
        )
        json_strings.append(json_string)
    
    value = resolve_json_path(path.split("."), formData)

    print()
    print(
        "###########",
        COLOR["path"] + path + COLOR["reset"],
        "=",
        value
    )
    for json_string, (start, end) in zip(json_strings, ranges):
        print(
            COLOR["range"] + f"{start}:{end}".ljust(11) + COLOR["reset"],
            json_string
        )
    for plain_string in plain_strings:
        print(
            COLOR["arrow"] + "=>".rjust(11) + COLOR["reset"],
            plain_string
        )
    
