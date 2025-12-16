import argparse
from pathlib import Path
from .commands import preview_structure, create_structure, undo_last_creation

def main():
    parser = argparse.ArgumentParser(description="DirectoryGen CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Preview command
    preview_parser = subparsers.add_parser("preview", help="Preview directory structure")
    preview_parser.add_argument("-s", "--structure", type=str, required=True, help="Directory structure text")

    # Create command
    create_parser = subparsers.add_parser("create", help="Create directory structure and ZIP")
    create_parser.add_argument("-s", "--structure", type=str, required=True, help="Directory structure text")
    create_parser.add_argument("-d", "--destination", type=str, required=True, help="Destination path")
    create_parser.add_argument("-n", "--name", type=str, required=True, help="Project name")

    # Undo command
    undo_parser = subparsers.add_parser("undo", help="Undo last creation")
    undo_parser.add_argument("-d", "--destination", type=str, required=True, help="Destination path")

    args = parser.parse_args()

    if args.command == "preview":
        preview = preview_structure(args.structure)
        print(preview)

    elif args.command == "create":
        dest_path = Path(args.destination)
        zip_file = create_structure(args.structure, dest_path, args.name)
        print(f"Project ZIP created at: {zip_file}")

    elif args.command == "undo":
        dest_path = Path(args.destination)
        if undo_last_creation(dest_path):
            print("Undo successful.")
        else:
            print("No manifest found. Nothing to undo.")

if __name__ == "__main__":
    main()
