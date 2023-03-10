import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetsGroup, Asset } from '../types/assetsGroup.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private http: HttpClient) { }

  getAssetsGroups(): Observable<AssetsGroup[]> {
    return this.http.get<AssetsGroup[]>(environment.api + environment.assetsGroup)
  }

  getAssetsGroup(id: string): Observable<AssetsGroup> {
    return this.http.get<AssetsGroup>(`${environment.api + environment.assetsGroup}/${id}`)
  }

  updateAssetsGroup(input: {
    id: string
    contributionT?: number
    label?: string
  }): Observable<AssetsGroup> {
    return this.http.put<AssetsGroup>(environment.api + environment.contributionTotal, {
      Id: input.id, ContributionTotal: input.contributionT, Label: input.label
    })
  }

  updateAsset(input: Asset, groupId: string): Observable<AssetsGroup> {
    return this.http.put<AssetsGroup>(environment.api + environment.assets,
      {
        Id: input.Id,
        GroupId: groupId,
        Label: input.Label,
        Score: input.Score,
        PreviousValue: input.PreviousValue,
        CurrentValue: input.CurrentValue,
        Include: input.Include,
      })
  }
  deleteAsset(id: string, groupId: string): Observable<AssetsGroup> {
    return this.http.request<AssetsGroup>("DELETE", environment.api + environment.assets, {
      body: {
        Id: id, GroupId: groupId
      }
    })
  }

  deleteAssetsGroup(id: string): Observable<any> {
    return this.http.request<AssetsGroup>("DELETE", environment.api + environment.assetsGroup, {
      body: {
        Id: id,
      }
    })
  }

  createAsset(input: Asset, groupId: string): Observable<AssetsGroup> {
    return this.http.post<AssetsGroup>(environment.api + environment.assets,
      {
        GroupId: groupId,
        Label: input.Label,
        Score: input.Score,
        PreviousValue: input.PreviousValue,
        CurrentValue: input.CurrentValue,
        Include: input.Include,
      })
  }
  createAssetsGroup(input: AssetsGroup): Observable<AssetsGroup> {
    return this.http.post<AssetsGroup>(environment.api + environment.assetsGroup, input)
  }
}
