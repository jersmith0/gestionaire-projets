import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakText'
})
export class BreakTextPipe implements PipeTransform {
  transform(value: string, maxChars: number = 80): string {
    if (!value) return '';

    const words = value.split(' ');
    let result = '';
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxChars) {
        result += currentLine.trim() + '\n';
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    result += currentLine.trim();
    return result;
  }
}