import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-export-icon',
  templateUrl: './export-icon.component.html',
  styleUrls: ['./export-icon.component.scss'],
})
export class ExportIconComponent {
  exportText = 'Export';

  @Output() exportClicked = new EventEmitter();

  export(): void {
    if (this.exportText !== 'Exporting') {
      this.exportText = 'Exporting';
      this.exportClicked.emit(true);
      setTimeout(() => {
        this.exportText = 'Export';
      }, 4000);
    }
  }
}
