const mapping: Record<string, string> = {
  'birth-charts': 'birth_chart',
  organizations: 'organization',
  predictions: 'prediction',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
