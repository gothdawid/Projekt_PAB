import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public account: any = {
    id: 21,
    firstName: 'Adam',
    lastName: 'Spadam',
    email: 'testowy@test.pl',
    avatar: 'http://i.stack.imgur.com/Dj7eP.jpg',
    group: '32',
    address: {
      id: 1,
      street: 'Szkolna 2',
      city: 'Zielona Góra'
    }
  }

  @ViewChild('editImageDialog')
  editImageDialog?: TemplateRef<any>;
  private editImageModal?: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public openImageModel(): void {
    this.editImageModal = this.modalService.open(this.editImageDialog, { centered: true });
  }

  public closeImageModal(): void {
    this.editImageModal?.close();
  }

  public deleteImage(): void {
    this.account.avatar = '';
  }

  public async onChange(event: any) {
    const file = event.target.files[0];
    this.account.avatar = await this.toBase64(file);
  }

  private toBase64(file: any): Promise<string | ArrayBuffer | null> {
      return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
  }
}
