import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AssetsGroup, Asset, emptyAsset, emptyAssetsGroup } from '../../types/assetsGroup.type';
import { AssetsService } from '../../services/assets.service';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';

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
  assetsGroup: AssetsGroup = emptyAssetsGroup

  constructor(
    private assetsService: AssetsService,
    private router: ActivatedRoute) {

    this.refreshGroup()
  }

  ngOnInit(): void {
  }

  calculateTotal() {
    const assets = this.assetsGroup!.Assets.filter(x => x.Include)
    this.total.CurrentValue = sum(assets, a => a.CurrentValue)
    this.total.PreviousValue = sum(assets, a => a.PreviousValue)
    this.total.ValueVariation = sum(assets, a => a.ValueVariation)
    this.total.FinalContribution = sum(assets, a => a.FinalContribution)
    this.total.PercentageFromTotal = sum(assets, a => a.PercentageFromTotal)
    this.total.Score = sum(assets, a => a.Score)
  }

  refreshGroup() {
    const id = this.router.snapshot.paramMap.get('id') ?? ''
    this.assetsService.getAssetsGroup(id).subscribe(a => {
      this.assetsGroup = a
      this.calculateTotal()
    })
  }

  updateContributionTotal(value: string) {

    const contributionV = Number(value) 

    this.assetsService.updateAssetsGroup({ id: this.assetsGroup!.Id, contributionT: contributionV })
      .subscribe(a => {
        this.assetsGroup = a
        this.calculateTotal()
      })
  }

  updateAsset(asset: Asset) {
    if (!asset.Include) {
      this.assetsService.updateAsset(asset, this.assetsGroup!.Id).pipe(
        tap(ag => {
          const includedAssets = ag.Assets.filter(x => x.Include)
          const distributedScore = asset.Score / includedAssets.length
          this.assetsGroup.Assets = includedAssets.map(a => {
            a.Score += distributedScore
            return a
          })
        }),
        tap(
          ag => ag.Assets.filter(x => x.Include).map(
            a => this.assetsService.updateAsset(a, this.assetsGroup!.Id).subscribe())
        )).subscribe(() => this.refreshGroup())
    }
    else if (asset.Include) {
      this.assetsService.getAssetsGroup(this.assetsGroup.Id).subscribe(ag1 => {
        const a = ag1.Assets.find(x => x.Id == asset.Id)!
        if (!a.Include) {
          this.recoverScore(asset, ag1.Id, ag1.Assets)
        }
        else {
          this.assetsService.updateAsset(asset, ag1.Id).subscribe(ag => {
            this.assetsGroup = ag
            this.calculateTotal()
          })
        }
      })

    }
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

  recoverScore(asset: Asset, id: string, assets: Asset[]) {
    this.assetsService.updateAsset(asset, id).pipe(
      tap((ag) => {
        const includedAssets = assets.filter(x => x.Include)
        const recoveredScore = asset.Score / includedAssets.length
        assets = includedAssets.map(a => {
          a.Score -= recoveredScore
          return a
        })
      }),
      tap(
        () => assets.filter(x => x.Include).map(
          a => this.assetsService.updateAsset(a, this.assetsGroup!.Id).subscribe())
      )).subscribe(() => this.refreshGroup())
  }

}
var sum = (assets: Asset[], sumPredicate: (asset: Asset) => number): number => {
  return assets.map(a => sumPredicate(a)).reduce((a, b) => a + b)
}