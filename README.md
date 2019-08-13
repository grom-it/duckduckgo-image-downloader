duckduckgo-image-downloader
===

Mass downloader tool for results from the Duckduckgo image search.

Prerequisites
---

- [Node.js](https://nodejs.org/)
- [aria2](https://aria2.github.io/) (high speed file downloader)

Installation
---

Clone GIT repository:

`$ git clone https://github.com/grom-it/duckduckgo-image-downloader.git`

Install tool globally (optional):

`$ sudo npm install -g`

Try it:

`$ duckduckgo-image-downloader <keywords>`

Files will be downloaded to a newly created directory (representing your keywords) below the current working directory.

Usage
---

```
duckduckgo-image-downloader [options] <keywords...>

Options:
  -i, --iterations <number>  Number of batches to fetch (each ~50 images) (default: 1)
  -r, --retries <number>     Number of retries (default: 2)
  -h, --help                 output usage information
```
