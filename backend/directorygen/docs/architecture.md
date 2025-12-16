# DirectoryGen Architecture Contract

This document defines the frozen architectural boundaries of DirectoryGen.

- dirgen_core contains all business logic and is framework-agnostic.
- backend and cli are thin wrappers over dirgen_core.
- No filesystem writes are allowed in dirgen_core.
- No FastAPI / Typer / Click imports are allowed in dirgen_core.
- All paths handled by dirgen_core are virtual paths.
