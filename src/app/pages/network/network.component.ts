import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
// eslint-disable-next-line no-duplicate-imports
import * as Highcharts from 'highcharts';
import {Options} from 'highcharts';
import HC_bullet from 'highcharts/modules/bullet';
import {ViewportService} from '@app/services/viewport/viewport.service';
import {ApiService} from '@app/services/api/api.service';
import {ConsensusStatsDto, NetworkStatsDto, PeerVersionsDto, QuorumDto, SupplyDto} from '@app/types/dto';

HC_bullet(Highcharts);

@Component({
    selector: 'app-page-one',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NetworkComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;

    loading = true;
    error = false;

    supplyChartOptions: Options;
    consensusChartOptions: Options;

    consensus: ConsensusStatsDto;
    supply: SupplyDto;
    peerVersions: PeerVersionsDto[];
    quorum: QuorumDto;
    nakamotoCoefficient: number;
    totalNumberOfPeers = 0;

    constructor(
        public vp: ViewportService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        void this._apiService
            .getNetworkStats()
            .then((response: NetworkStatsDto) => {
                this.consensus = response.consensus;
                this.supply = response.supply;
                this.quorum = response.quorum;
                this.peerVersions = response.peerVersions;
                this.nakamotoCoefficient = response.nakamotoCoefficient;
                this.consensusChartOptions = this._createConsensusChart(response.consensus);
                this.supplyChartOptions = this._createSupplyChart(response.supply);
                this.peerVersions.map((version) => { this.totalNumberOfPeers += version.count});
                this.loading = false;
            })
            .catch((err) => {
                console.error(err);
                this.error = true;
                this.loading = false;
            });
    }

    calcPeerVersionPercentage(count: number): any {
        return Math.round(count / this.totalNumberOfPeers * 100);
    }

    private _createSupplyChart(supply: SupplyDto): Options {
        return {
            tooltip: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
            title: {
                text: '',
            },
            series: [
                {
                    name: 'supply',
                    type: 'pie',
                    colors: ['#FBDD11', '#4CBF4B'],
                    data: [
                        {
                            name: 'Circulating',
                            y: supply.circulatingAmount,
                        },
                        {
                            name: 'Team Funds',
                            y: supply.devFundAmount,
                        },
                    ],
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        style: { fontSize: this.vp.sm ? '12px' : '14px', fontWeight: '400', fontFamily: 'Open Sans', color: '#424e54', textOutline: 'none' },
                        format: '{point.name}: <br/><strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }

    private _createConsensusChart(consensus: ConsensusStatsDto): Options {
        const format = (num: number): number => Number(parseFloat(String(num * 100)).toFixed(2));
        const data = [
            ['Official Online', format(consensus.official.onlinePercent)],
            ['Unofficial Online', format(consensus.unofficial.onlinePercent)],
            ['Unofficial Offline', format(consensus.unofficial.offlinePercent)],
            ['No Rep', format(consensus.noRep.percent)],
        ];
        if (this.consensus.official.offlineAmount !== 0) {
            data.push(['Official Offline', format(consensus.official.offlinePercent)]);
        }
        return {
            plotOptions: {
                pie: {
                    innerSize: '80%',
                },
            },
            credits: {
                enabled: false,
            },
            tooltip: {
                enabled: false,
            },
            title: {
                text: '',
            },
            series: [
                {
                    name: 'Consensus',
                    type: 'pie',
                    colors: ['#FBDD11', '#4CBF4B', 'red', 'gray', 'pink'],
                    data,
                    dataLabels: {
                        enabled: true,
                        distance: 25,
                        style: { fontSize: this.vp.sm ? '12px' : '14px', fontWeight: '400', fontFamily: 'Open Sans', color: '#424e54', textOutline: 'none' },
                        format: '{point.name}: <br/><strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }
}
