import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AssetsGroup, emptyAssetsGroup } from '../types/assetsGroup.type';
import { AssetsService } from '../services/assets.service';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  assetsGroups: AssetsGroup[] = []
  editing?: AssetsGroup

  constructor(private assetsService: AssetsService,
    private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.refreshAssetsGroup()
  }

  addAssetsGroup() {
    this.assetsService.createAssetsGroup(emptyAssetsGroup).subscribe(
      () => this.refreshAssetsGroup())
  }

  deleteAssetsGroup(id: string) {
    this.assetsService.deleteAssetsGroup(id).subscribe(
      () => this.refreshAssetsGroup())
  }

  editAssetsGroup(group: AssetsGroup) {
    this.editing = group

    const dialogRef = this.dialog.open(DialogDefault, {
      data: group.Label,
      panelClass: 'dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!this.editing) return
      this.assetsService.updateAssetsGroup({ id: this.editing!.Id, label: result }).subscribe(
        () => this.refreshAssetsGroup())
    });
  }

  refreshAssetsGroup() {
    this.assetsService.getAssetsGroups().subscribe(a => {
      this.assetsGroups = a
    })
  }
}

@Component({
  selector: 'dialog-default',
  styleUrls: ['assets.component.scss'],
  templateUrl: 'dialog-default.html',
})
export class DialogDefault implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<DialogDefault>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { 
  }
  @ViewChild('linput') linput!: ElementRef
  
  ngAfterViewInit(): void {
    this.dialogRef.keydownEvents().subscribe(e => {
      if(e.key == 'Enter') {
        this.dialogRef.close(this.data)
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}