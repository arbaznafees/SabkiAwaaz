/**
 * App-wide constants — constituencies, map URLs, ward lists.
 */

export const CONSTITUENCIES = [
  'New Delhi Central',
  'Mumbai South',
  'Bengaluru Central',
];

export const MAPS_BY_CONSTITUENCY: Record<string, string> = {
  'New Delhi Central':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDt3yinK03GRMe324GkxfISa4xsjNpi54j1dU0PjzperqbPLDD8OVIBr3_vp184Jr4PwVDSUWfYbSHOoN2cjUZLXcGIfx92YeqM4kqo_6fuq1e0T6AHeEpE6pEZhkCA1afDXiRLhb75AedDV1qMBymNEpt6qUgUdeDrcSNUazKf1TebmsmuPVQaZiz0TWm119dTUOZLcmupids4t2_scvWmUjHPlUzQyr92ZyZiX58KlyIlKrm1qvP5HRWZkZ7n1E_yZXZsh5NJ4F0',
  'Mumbai South':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDt3yinK03GRMe324GkxfISa4xsjNpi54j1dU0PjzperqbPLDD8OVIBr3_vp184Jr4PwVDSUWfYbSHOoN2cjUZLXcGIfx92YeqM4kqo_6fuq1e0T6AHeEpE6pEZhkCA1afDXiRLhb75AedDV1qMBymNEpt6qUgUdeDrcSNUazKf1TebmsmuPVQaZiz0TWm119dTUOZLcmupids4t2_scvWmUjHPlUzQyr92ZyZiX58KlyIlKrm1qvP5HRWZkZ7n1E_yZXZsh5NJ4F0',
  'Bengaluru Central':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDt3yinK03GRMe324GkxfISa4xsjNpi54j1dU0PjzperqbPLDD8OVIBr3_vp184Jr4PwVDSUWfYbSHOoN2cjUZLXcGIfx92YeqM4kqo_6fuq1e0T6AHeEpE6pEZhkCA1afDXiRLhb75AedDV1qMBymNEpt6qUgUdeDrcSNUazKf1TebmsmuPVQaZiz0TWm119dTUOZLcmupids4t2_scvWmUjHPlUzQyr92ZyZiX58KlyIlKrm1qvP5HRWZkZ7n1E_yZXZsh5NJ4F0',
};

export const WARD_OPTIONS = [
  'Ward 1 - Moderate',
  'Ward 2 - Moderate',
  'Ward 3 - Moderate',
  'Ward 4 - High Intensity',
  'Ward 5 - Low Intensity',
  'Ward 7 - Critical',
];
