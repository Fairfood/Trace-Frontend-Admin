import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ChangeAvatarComponent } from '../change-avatar';
@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss'],
  standalone: true,
  imports: [NgIf, MatIconModule, ChangeAvatarComponent, MatDialogModule],
})
export class ProfileAvatarComponent {
  @Input() imageUrl?: string;
  @Input() avatar?: string;

  @Input() isEditing?: boolean;

  @Output() itemClicked = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openImageUpload(): void {
    const dialogRef = this.dialog.open(ChangeAvatarComponent, {
      disableClose: true,
      width: '450px',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: {
        image: this.imageUrl || '',
        roundCrope: true,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemClicked.emit(result);
      }
    });
  }
}
