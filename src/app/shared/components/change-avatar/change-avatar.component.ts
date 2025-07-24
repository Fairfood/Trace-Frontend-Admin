/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonsComponent } from 'fairfood-utils';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

interface DialogData {
  image: string;
  roundCrope: boolean;
}

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, ImageCropperModule, MatIconModule, ButtonsComponent],
})
export class ChangeAvatarComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImg: any;
  savePro = false;
  base64: any;
  uploader: any;
  deleteProfilePic = false;
  roundCrope: boolean;
  loader = false;
  constructor(
    public dialogRef: MatDialogRef<ChangeAvatarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.roundCrope = this.data.roundCrope;
  }

  // method to select image
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  // method close image upload pop-up
  close(): void {
    this.dialogRef.close({
      type: 'dismiss',
    });
  }

  crop(): void {
    this.croppedImg = this.croppedImage;
    this.savePro = true;
  }

  // method to upload new image
  upload(): void {
    this.loader = true;
    if (this.croppedImg) {
      this.base64 = this.croppedImg;
    } else {
      this.base64 = this.croppedImage;
    }
    const date = new Date().valueOf();
    let text = '';
    const possibleText =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type
    const imageName = date + '.' + text + '.png';
    // call method that creates a blob from dataUri
    const imageBlob = this.dataURItoBlob(this.base64);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
    const formData = new FormData();
    formData.append('image', imageFile);
    this.dialogRef.close({
      type: 'upload',
      formData,
      image: this.base64,
    });
  }

  dataURItoBlob(dataURI: any): any {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  delete(): void {
    this.deleteProfilePic = true;
  }

  confirmDelete(): void {
    const formData = new FormData();
    formData.append('image', '');
    this.dialogRef.close({
      type: 'delete',
      formData,
      image: '',
    });
  }

  cancel(): void {
    this.deleteProfilePic = false;
  }
}
