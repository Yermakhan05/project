import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filePreview',
  standalone: true, // ⚡ Включаем поддержку Standalone Components
})
export class FilePreviewPipe implements PipeTransform {
  transform(file: File | null): string {
    return file ? URL.createObjectURL(file) : '';
  }
}
