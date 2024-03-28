import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { DelegatorDto } from '@app/types/dto';
import { UtilService } from '@app/services/util/util.service';
import { CdkTableDataSourceInput } from '@angular/cdk/table';

@Injectable({
    providedIn: 'root',
})
export class DelegatorsTabService {
    private isLoading: boolean;
    private formattedWeight: string;
    private weightedDelegatorsCount: number;
    private matTableDatasource: any;
    private delegators: DelegatorDto[] = [];

    constructor(private readonly _apiService: ApiService, private readonly _util: UtilService) {}

    forgetAccount(): void {
        this.matTableDatasource = [];
        this.delegators = [];
        this.formattedWeight = undefined;
        this.weightedDelegatorsCount = undefined;
    }

    getTableDataSource(): CdkTableDataSourceInput<any> {
        return this.matTableDatasource;
    }

    isLoadingDelegators(): boolean {
        return this.isLoading;
    }

    getWeight(): string {
        return this.formattedWeight;
    }

    getDelegators(): DelegatorDto[] {
        return this.delegators;
    }

    getWeightedDelegatorsCount(): number {
        return this.weightedDelegatorsCount;
    }

    hasDelegators(): boolean {
        return this.delegators.length !== 0;
    }

    /** This conditionally shows the 'Load More' button to fetch more delegators. */
    canLoadMoreDelegators(): boolean {
        return this.hasDelegators() && this.getDelegators().length < this.getWeightedDelegatorsCount();
    }

    /** Call this method to load delegators.
     * If delegators have already been loaded, fetches the next delegators in the list. */
    fetchDelegators(address: string, newAccount?: boolean): Promise<void> {
        if (newAccount) {
            this.forgetAccount();
        }

        if (this.isLoading) {
            return;
        }

        this.isLoading = true;
        return new Promise((resolve) => {
            this._apiService
                .fetchAccountDelegators(address, this.delegators.length)
                .then((data) => {
                    this.delegators.push(...data.delegators);
                    this.weightedDelegatorsCount = data.fundedCount;

                    // Format the weight Sum
                    if (data.weightSum) {
                        this.formattedWeight = this._util.numberWithCommas(data.weightSum.toFixed(2));
                    } else {
                        this.formattedWeight = '0';
                    }

                    // Format the Datasource
                    this.matTableDatasource = [];
                    this.delegators.map((delegator) => {
                        delegator.weight = this._util.numberWithCommas(delegator.weight) as any;
                        this.matTableDatasource.push(delegator);
                    });
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.isLoading = false;
                    resolve();
                });
        });
    }
}
