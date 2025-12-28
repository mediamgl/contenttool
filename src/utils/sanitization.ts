export const sanitization = {
  escapeHtml: (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  stripHtmlTags: (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  },

  sanitizeForDisplay: (content: string): string => {
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'];
    const allowedAttributes = ['href', 'title', 'class'];

    const doc = new DOMParser().parseFromString(content, 'text/html');

    const walker = doc.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_ELEMENT,
      null
    );

    const nodesToRemove: Element[] = [];

    while (walker.nextNode()) {
      const node = walker.currentNode as Element;

      if (!allowedTags.includes(node.tagName.toLowerCase())) {
        nodesToRemove.push(node);
        continue;
      }

      const attributes = Array.from(node.attributes);
      attributes.forEach(attr => {
        if (!allowedAttributes.includes(attr.name)) {
          node.removeAttribute(attr.name);
        }
      });

      if (node.tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        if (href) {
          if (href.startsWith('javascript:') || href.startsWith('data:')) {
            node.removeAttribute('href');
          }
        }
      }
    }

    nodesToRemove.forEach(node => {
      const parent = node.parentNode;
      if (parent) {
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
      }
    });

    return doc.body.innerHTML;
  },

  removeScripts: (content: string): string => {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
  },

  sanitizeUserInput: (input: string): string => {
    let sanitized = input.trim();

    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    sanitized = sanitization.removeScripts(sanitized);

    return sanitized;
  },

  sanitizeMarkdown: (markdown: string): string => {
    let sanitized = sanitization.sanitizeUserInput(markdown);

    sanitized = sanitized.replace(/!\[([^\]]*)\]\((javascript:[^\)]+)\)/gi, '');
    sanitized = sanitized.replace(/\[([^\]]*)\]\((javascript:[^\)]+)\)/gi, '[$1]()');

    return sanitized;
  },

  truncate: (text: string, maxLength: number, ellipsis = '...'): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - ellipsis.length) + ellipsis;
  },

  sanitizeFileName: (fileName: string): string => {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  },

  preventSqlInjection: (input: string): string => {
    return input
      .replace(/['";\\]/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  },

  sanitizeSearchQuery: (query: string): string => {
    let sanitized = query.trim();

    sanitized = sanitized.replace(/[<>'"]/g, '');

    sanitized = sanitized.substring(0, 200);

    return sanitized;
  },
};
