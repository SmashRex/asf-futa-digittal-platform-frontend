/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DepartmentItem {
  id: string;
  name: string;
  faculty?: string;
}

/**
 * Authoritative department catalog for the Federal University of Technology, Akure (FUTA).
 * Structured with stable slug identifiers (departmentId) matching authoritative backend contracts.
 */
export const DEPARTMENTS: DepartmentItem[] = [
  // School of Computing (SOC)
  { id: 'computer-science', name: 'Computer Science', faculty: 'School of Computing' },
  { id: 'software-engineering', name: 'Software Engineering', faculty: 'School of Computing' },
  { id: 'cyber-security', name: 'Cyber Security', faculty: 'School of Computing' },
  { id: 'information-systems', name: 'Information Systems', faculty: 'School of Computing' },
  { id: 'information-technology', name: 'Information Technology', faculty: 'School of Computing' },

  // School of Engineering and Engineering Technology (SEET)
  { id: 'agricultural-engineering', name: 'Agricultural and Environmental Engineering', faculty: 'SEET' },
  { id: 'civil-engineering', name: 'Civil and Environmental Engineering', faculty: 'SEET' },
  { id: 'computer-engineering', name: 'Computer Engineering', faculty: 'SEET' },
  { id: 'electrical-engineering', name: 'Electrical and Electronics Engineering', faculty: 'SEET' },
  { id: 'industrial-engineering', name: 'Industrial and Production Engineering', faculty: 'SEET' },
  { id: 'mechanical-engineering', name: 'Mechanical Engineering', faculty: 'SEET' },
  { id: 'metallurgical-engineering', name: 'Metallurgical and Materials Engineering', faculty: 'SEET' },
  { id: 'mining-engineering', name: 'Mining Engineering', faculty: 'SEET' },

  // School of Sciences (SOS)
  { id: 'biochemistry', name: 'Biochemistry', faculty: 'School of Sciences' },
  { id: 'biology', name: 'Biology', faculty: 'School of Sciences' },
  { id: 'chemistry', name: 'Chemistry', faculty: 'School of Sciences' },
  { id: 'mathematical-sciences', name: 'Mathematical Sciences', faculty: 'School of Sciences' },
  { id: 'microbiology', name: 'Microbiology', faculty: 'School of Sciences' },
  { id: 'physics', name: 'Physics', faculty: 'School of Sciences' },
  { id: 'statistics', name: 'Statistics', faculty: 'School of Sciences' },

  // School of Earth and Mineral Sciences (SEMS)
  { id: 'applied-geology', name: 'Applied Geology', faculty: 'SEMS' },
  { id: 'applied-geophysics', name: 'Applied Geophysics', faculty: 'SEMS' },
  { id: 'marine-science-technology', name: 'Marine Science and Technology', faculty: 'SEMS' },
  { id: 'meteorology-climate-science', name: 'Meteorology and Climate Science', faculty: 'SEMS' },
  { id: 'remote-sensing-gis', name: 'Remote Sensing and GIS', faculty: 'SEMS' },

  // School of Environmental Technology (SET)
  { id: 'architecture', name: 'Architecture', faculty: 'School of Environmental Technology' },
  { id: 'building-technology', name: 'Building', faculty: 'School of Environmental Technology' },
  { id: 'estate-management', name: 'Estate Management', faculty: 'School of Environmental Technology' },
  { id: 'industrial-design', name: 'Industrial Design', faculty: 'School of Environmental Technology' },
  { id: 'quantity-surveying', name: 'Quantity Surveying', faculty: 'School of Environmental Technology' },
  { id: 'surveying-geoinformatics', name: 'Surveying and Geoinformatics', faculty: 'School of Environmental Technology' },
  { id: 'urban-regional-planning', name: 'Urban and Regional Planning', faculty: 'School of Environmental Technology' },

  // School of Agriculture and Agricultural Technology (SAAT)
  { id: 'agricultural-economics', name: 'Agricultural and Resource Economics', faculty: 'SAAT' },
  { id: 'agricultural-extension', name: 'Agricultural Extension and Communication Technology', faculty: 'SAAT' },
  { id: 'animal-production-health', name: 'Animal Production and Health', faculty: 'SAAT' },
  { id: 'crop-soil-pest-management', name: 'Crop, Soil and Pest Management', faculty: 'SAAT' },
  { id: 'fisheries-aquaculture', name: 'Fisheries and Aquaculture Technology', faculty: 'SAAT' },
  { id: 'food-science-technology', name: 'Food Science and Technology', faculty: 'SAAT' },
  { id: 'forestry-wood-technology', name: 'Forestry and Wood Technology', faculty: 'SAAT' },
  { id: 'ecotourism-wildlife', name: 'Ecotourism and Wildlife Management', faculty: 'SAAT' },

  // School of Health and Health Technology (SHHT)
  { id: 'human-anatomy', name: 'Human Anatomy', faculty: 'SHHT' },
  { id: 'physiology', name: 'Physiology', faculty: 'SHHT' },
  { id: 'biomedical-technology', name: 'Biomedical Technology', faculty: 'SHHT' },

  // School of Management Technology (SMAT)
  { id: 'project-management', name: 'Project Management Technology', faculty: 'SMAT' },
  { id: 'transport-management', name: 'Transport Management Technology', faculty: 'SMAT' },
  { id: 'library-information-science', name: 'Library and Information Science', faculty: 'SMAT' },
];

/**
 * Returns the human-readable department name for a given departmentId.
 * Gracefully formats the slug if an unlisted departmentId is encountered.
 */
export function getDepartmentName(departmentId?: string | null): string {
  if (!departmentId) return '';
  const match = DEPARTMENTS.find(d => d.id.toLowerCase() === departmentId.toLowerCase());
  if (match) return match.name;

  // Fallback to title-cased slug formatting if not found in catalog
  return departmentId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Resolves a departmentId from a legacy department string or returns empty string.
 */
export function findDepartmentIdByName(name?: string | null): string {
  if (!name) return '';
  const lower = name.trim().toLowerCase();
  const match = DEPARTMENTS.find(d => d.name.toLowerCase() === lower || d.id === lower);
  return match ? match.id : '';
}
