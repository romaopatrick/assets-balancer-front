import { Component, OnInit } from '@angular/core';
import { AssetsGroup } from '../types/assetsGroup.type';
import { AssetsService } from '../services/assets.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  assetsGroups: AssetsGroup[] = []

  constructor(private assetsService: AssetsService) {
  }
  ngOnInit(): void {
    this.assetsService.getAssetsGroups().subscribe(a => {
      this.assetsGroups = a
    })
  }

  addAssetsGroup() {
  }
}
