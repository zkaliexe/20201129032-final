import { MakaleFoto } from './../../../models/MakaleFoto';
import { Component, Inject, OnInit } from '@angular/core';
import { Makale } from 'src/app/models/Makale';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-makale-foto-dialog',
  templateUrl: './makale-foto-dialog.component.html',
  styleUrls: ['./makale-foto-dialog.component.scss']
})
export class MakaleFotoDialogComponent implements OnInit {

  secilenFoto: any;
  ogrFoto: MakaleFoto = new MakaleFoto();
  secOgrenci: Makale;
  constructor(
    public dialogRef: MatDialogRef<MakaleFotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiServis: ApiService
  ) {
    this.secOgrenci = this.data;
  }

  ngOnInit() {
  }
  FotoSec(e: any) {
    var fotolar = e.target.files;
    var foto = fotolar[0];
    var fr = new FileReader();
    fr.onload = () => {
      this.secilenFoto = fr.result,
        this.ogrFoto.FotoData = fr.result.toString(),
        this.ogrFoto.FotoUzanti = foto.type
    }
    fr.readAsDataURL(foto);
  }

}
