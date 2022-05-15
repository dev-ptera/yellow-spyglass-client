import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { AliasService } from '@app/services/alias/alias.service';
import { SearchService } from '@app/services/search/search.service';

@Component({
    selector: 'app-vanity',
    templateUrl: 'vanity.component.html',
})
export class VanityComponent implements OnInit {
    loading: boolean;
    error: boolean;
    vanityAddresses = [
        'ban_19bantanopcajd8ptfg9aedn8osgrzyrbupte5j4p1je69e5diz8qtc4dopf',
        'ban_1bboss18y784j9rbwgt95uwqamjpsi9oips5syohsjk37rn5ud7ndbjq61ft',
        'ban_1bigturd8xaryj3q3q9h9xz9t69xyzqc7oketrx6dww3hbugjso7bk539q1r',
        'ban_1creepi89mp48wkyg5fktgap9j6165d8yz6g1fbe5pneinz3by9o54fuq63m',
        'ban_1defi11tou1nbhyp8y4onwsiq5jcur19xe54mcmew1xonnz6e1d1sw74yefu',
        'ban_1duckjfam7tcartyzk4eeouu17h7t8bpcjyyh4o31ih3qd7scz9w5a4u6qd4',
        'ban_1eska1qx1cd1x7tkbo4wmuofpsq69dekk7h5n6yo967kjq43nhhobrhno95x',
        'ban_1fomofudww7niykjtpzqgu9zpojtxx1f4pedjguk1gsrft44ere77sh1ky8g',
        'ban_1h11mrypctfiexeo3swn1odo78uazf8oudrbqhcpzqyxjpu7eksrad8t1shg',
        'ban_1ka1ium4pfue3uxtntqsrib8mumxgazsjf58gidh1xeo5te3whsq8z476goo',
        'ban_1kirby19w89i35yenyesnz7zqdyguzdb3e819dxrhdegdnsaphzeug39ntxj',
        'ban_1monkeyt1x77a1rp9bwtthajb8odapbmnzpyt8357ac8a1bcron34i3r9y66',
        'ban_1purian887obzya9jjrsz18eiu45dzzgr9q1mh1zg7rw1kybgx5nmr843afb',
        'ban_1wirginxksoeggr1u51a797tytmicokwnxxsosmd1q3mapuad4j6hdzeh617',
        'ban_1yekta1xn94qdnbmmj1tqg76zk3apcfd31pjmuy6d879e3mr469a4o4sdhd4',
        'ban_31dhbgirwzd3ce7naor6o94woefws9hpxu4q8uxm1bz98w89zqpfks5rk3ad',
        'ban_3fudcakefr9jyw7b4kfafrgaekmd37ez7q4pmzuo1fd7wo9jo8gsha7z7e1c',
        'ban_3hxnx1gegfqmmhcnd13qipjxgo7mbw1bwprxq7334sr5b4hie5u1wj845n6m',
    ];

    constructor(
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _searchService: SearchService,
        public monkeyCache: MonkeyCacheService,
        public aliasService: AliasService,
        public vp: ViewportService
    ) {}

    ngOnInit(): void {
        this._fetchVanityMonkeys();
    }

    private _fetchVanityMonkeys(): void {
        this.loading = true;
        const monkeyPromise: Array<Promise<void>> = [];
        for (const address of this.vanityAddresses) {
            if (this.monkeyCache.getMonkey(address)) {
                continue;
            }
            monkeyPromise.push(
                this._apiService
                    .fetchMonKey(address)
                    .then((monkey: string) => {
                        this.monkeyCache.addCache(address, monkey);
                        return Promise.resolve();
                    })
                    .catch((err) => {
                        console.error(err);
                        this.error = true;
                        this.loading = false;
                        return Promise.reject(err);
                    })
            );
        }
        void Promise.all(monkeyPromise).then(() => {
            this.loading = false;
            this._ref.detectChanges();
        });
    }

    search(address: string): void {
        this._searchService.emitSearch(address);
    }
}
