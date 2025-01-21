class MarkdownParser {
  private container: HTMLElement;
  private buffer: string;
  private isInsideCodeBlock: boolean;
  private isInsideInlineCode: boolean;

  constructor(container: HTMLElement) {
    this.container = container;
    this.buffer = '';
    this.isInsideCodeBlock = false;
    this.isInsideInlineCode = false;
  }

  appendChunk(chunk: string) {
    this.buffer += chunk;

    let renderedContent = '';
    let i = 0;

    while (i < this.buffer.length) {
      const char = this.buffer[i];

      // Check for start or end of a code block (triple backticks)
      if (this.buffer.slice(i, i + 3) === '```') {
        if (this.isInsideCodeBlock) {
          renderedContent += '</pre>'; // Close code block
          this.isInsideCodeBlock = false;
        } else {
          renderedContent += '<pre>'; // Start code block
          this.isInsideCodeBlock = true;
        }
        i += 3;
        continue;
      }

      // Check for start or end of an inline code block (single backtick)
      if (char === '`') {
        if (this.isInsideInlineCode) {
          renderedContent += '</code>'; // Close inline code
          this.isInsideInlineCode = false;
        } else {
          renderedContent += '<code>'; // Start inline code
          this.isInsideInlineCode = true;
        }
        i++;
        continue;
      }

      // Handle normal characters
      if (this.isInsideCodeBlock || this.isInsideInlineCode) {
        renderedContent += char; // Render code content as-is
      } else {
        // Escape HTML for normal text
        if (char === '<') renderedContent += '&lt;';
        else if (char === '>') renderedContent += '&gt;';
        else if (char === '&') renderedContent += '&amp;';
        else renderedContent += char;
      }

      i++;
    }

    this.buffer = ''; // Clear buffer after processing
    this.appendToContainer(renderedContent);
  }

  private appendToContainer(content: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    while (tempDiv.firstChild) {
      this.container.appendChild(tempDiv.firstChild);
    }
  }
}

export default MarkdownParser;
