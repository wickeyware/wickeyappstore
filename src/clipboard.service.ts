import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

// Thank-you: https://www.bennadel.com/blog/3235-creating-a-simple-copy-to-clipboard-directive-in-angular-2-4-9.htm

@Injectable()
export class ClipboardService {
  private dom: Document;
  constructor( @Inject( DOCUMENT ) dom: Document ) {
    this.dom = dom;
  }

  // Copy the passed value to the user's system clipboard.
  public copy( value: string ): Promise<any> {
    const copyPromise = new Promise(
      ( resolve, reject ) => {
        let textarea = null;
        try {
          // In order to execute `Copy` (to clipboard), we need to create a text object and select it.
          // NOTE: This is being rendered off-screen.
          textarea = this.dom.createElement('textarea');
          textarea.style.height = '0px';
          textarea.style.left = '-100px';
          textarea.style.opacity = '0';
          textarea.style.position = 'fixed';
          textarea.style.top = '-100px';
          textarea.style.width = '0px';
          this.dom.body.appendChild(textarea);
          textarea.value = value;
          textarea.select();
          // Execute the browser's copy to clipboard function.
          this.dom.execCommand('copy');
          resolve( value );
        } catch (error) {
          reject(error);
        } finally {
					// Cleanup - remove the Textarea from the DOM if it was injected.
          if ( textarea && textarea.parentNode ) {
            textarea.parentNode.removeChild( textarea );
          }
        }
      }
    );
    return copyPromise;
  }
}
