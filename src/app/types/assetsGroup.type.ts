export type Asset = {
    Id: string
    Label: string
    Score: number
    PreviousValue: number
    CurrentValue: number
    ValueVariation: number
    PercentageFromTotal: number
    FinalContribution: number
    Include: boolean
}

export type AssetsGroup = {
    Id: string
    Label: string
    Assets: Asset[]
    ContributionTotal: number
}

export const emptyAsset: Asset = {
    CurrentValue: 0,
    FinalContribution: 0,
    Id: '',
    Label: 'Label',
    PercentageFromTotal: 0,
    PreviousValue: 0,
    Score: 0,
    ValueVariation: 0,
    Include: false,
}

export const emptyAssetsGroup: AssetsGroup = {
    Assets: [],
    ContributionTotal: 1000,
    Label: "Label",
    Id: ""
}