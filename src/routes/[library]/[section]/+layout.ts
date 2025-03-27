import { error } from '@sveltejs/kit';
import type { LayoutLoad } from '../$types';

export const load: LayoutLoad = ({ params }) => {
    let section:string = '';
    if (params.section === 'circulation') {
        section = 'Section';
    } else if (params.section === 'the-learning-commons') {
        section = 'Section';
    } else if (params.section === 'ground-floor-services') {
        section = 'Section';
    }

	if (section) {
        if (params.library === 'engglib1') {
            return {
                libraryName: 'Building',
                libraryBuilding: ' Building, ',
                libraryStreet: 'Street, UP Diliman',
                librarySrc: '../../../photos/placeholder.png',
                librarySection: section
            };
        } else if (params.library === 'engglib2') {
            return {
                libraryName: 'Building',
                libraryBuilding: 'Building,',
                libraryStreet: 'Street, UP Diliman',
                librarySrc: '../../../photos/placeholder.png',
                librarySection: section
            };
        }
    }
	error(404, 'Not found');
};
