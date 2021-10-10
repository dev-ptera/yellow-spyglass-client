import { Injectable } from '@angular/core';
import { MonitoredRepDto } from '@app/types/dto';

@Injectable({
    providedIn: 'root',
})
export class RepresentativesService {

    openMonitoredRep(rep: MonitoredRepDto): void {
        if (rep.customMonitorPageUrl) {
            window.open(rep.customMonitorPageUrl, '_blank');
        } else if (rep.ip.includes('http') || rep.ip.includes('https')) {
            window.open(`${rep.ip}`, '_blank');
        } else {
            window.open(`http://${rep.ip}`, '_blank');
        }
    }

    formatVersion(version: string): string {
        if (version) {
            return version.toUpperCase().replace('BANANO', '');
        }
        return '';
    }
}
