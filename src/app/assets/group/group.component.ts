import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AssetsGroup, Asset, emptyAsset } from '../../types/assetsGroup.type';
import { AssetsService } from '../../services/assets.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  total: Asset = {
    CurrentValue: 0,
    FinalContribution: 0,
    Id: '',
    Label: 'Total',
    PercentageFromTotal: 1,
    PreviousValue: 0,
    Score: 100,
    ValueVariation: 0,
    Include: true,
  }

  constructor(
    private assetsService: AssetsService,
    private router: ActivatedRoute) {

    this.getGroup()
  }

  ngOnInit(): void {
  }
  assetsGroup?: AssetsGroup

  calculateTotal() {
    const assets = this.assetsGroup!.Assets.filter(x => x.Include)
    this.total.CurrentValue = sum(assets, a => a.CurrentValue)
    this.total.PreviousValue = sum(assets, a => a.PreviousValue)
    this.total.ValueVariation = sum(assets, a => a.ValueVariation)
    this.total.FinalContribution = sum(assets, a => a.FinalContribution)
    this.total.PercentageFromTotal = sum(assets, a => a.PercentageFromTotal)
    this.total.Score = sum(assets, a => a.Score)
  }

  getGroup() {
    const id = this.router.snapshot.paramMap.get('id') ?? ''
    this.assetsService.getAssetsGroup(id).subscribe(a => {
      this.assetsGroup = a
      this.calculateTotal()
    })
  }

  updateContributionTotal(value: string) {
    var numberPattern = /\d+/g;

    value = value.match(numberPattern)!.join('')
    const contributionV = Number(value)

    this.assetsService.updateContributionTotal(this.assetsGroup!.Id, contributionV)
      .subscribe(a => {
        this.assetsGroup = a,
          this.calculateTotal()
      })
  }

  updateAsset(asset: Asset) {
    if (!asset.Include) {
      this.assetsService.updateAsset(asset, this.assetsGroup!.Id).subscribe(ag => {
        const distributedScore = (100 - sum(ag.Assets.filter(x => x.Include), a => a.Score)) / Math.floor(ag.Assets.filter(x => x.Include).length)
        this.assetsGroup!.Assets.filter(x => x.Include).map(a => {
          a.Score += distributedScore
          this.assetsService.updateAsset(a, this.assetsGroup!.Id).subscribe(ag => {
            this.assetsGroup = ag
            this.calculateTotal()
          })
        })
      })
    }
    else this.assetsService.updateAsset(asset, this.assetsGroup!.Id).subscribe(a => {
      this.assetsGroup = a,
        this.calculateTotal()
    })




  }

  addEmptyAsset() {
    this.assetsService.createAsset(emptyAsset, this.assetsGroup!.Id).subscribe(a => {
      this.assetsGroup = a,
        this.calculateTotal()
    })
  }

  deleteAsset(asset: Asset) {
    this.assetsService.deleteAsset(asset.Id, this.assetsGroup!.Id).subscribe(a => {
      this.assetsGroup = a,
        this.calculateTotal()
    })
  }

}
var sum = (assets: Asset[], sumPredicate: (asset: Asset) => number): number => {
  return assets.map(a => sumPredicate(a)).reduce((a, b) => a + b)
}