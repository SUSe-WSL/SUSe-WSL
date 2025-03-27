import { error } from '@sveltejs/kit';
import type { LayoutLoad } from '../$types';

export const load: LayoutLoad = ({ params }) => {
    let section:string = '';
    if (params.section === 'circulation') {
        section = 'Circulation';
    } else if (params.section === 'the-learning-commons') {
        section = 'The Learning Commons';
    } else if (params.section === 'ground-floor-services') {
        section = 'Ground Floor Service';
    }

	if (section) {
        if (params.library === 'engglib1') {
            return {
                libraryName: 'Library 1',
                libraryBuilding: ' Building, ',
                libraryStreet: 'Street, UP Diliman',
                librarySrc: '../../../photos/placeholder.png',
                librarySection: section
            };
        } else if (params.library === 'engglib2') {
            return {
                libraryName: 'Library 2',
                libraryBuilding: 'Building,',
                libraryStreet: 'Street, UP Diliman',
                librarySrc: '../../../photos/placeholder.png',
                librarySection: section
            };
        }
    }
	error(404, 'Not found');
};
