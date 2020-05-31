import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
  @Output() onImageCropped = new EventEmitter();
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  modalActions = new EventEmitter<string|MaterializeAction>();
  constructor() { }

  ngOnInit(): void {
  }

  stopPropagation(event: Event){
    event.stopPropagation();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {

  }
  cropperReady() {
    this.onImageCropped.emit(this.croppedImage);
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }
  loadImageFailed() {
      // show message
  }

  openModal(event){
    this.imageChangedEvent = event;
    this.modalActions.emit({action : 'modal', params : ['open']});
  }

  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }

}
