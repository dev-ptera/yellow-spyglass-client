import { style, transition, trigger, animate } from '@angular/animations';

/** This is an experimental file, see the networking page for a sample placeholder loading screen. */
export const faded = trigger('fade', [
    transition(':enter', [
        // using status here for transition
        style({ opacity: 0 }),
        animate(250, style({ opacity: 1 })),
    ]),
    /*transition(':leave', [
        animate(250, style({ opacity: 0 }))
    ])*/
]);
