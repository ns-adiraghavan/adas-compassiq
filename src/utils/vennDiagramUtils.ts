
export interface EntityFeatureData {
  name: string;
  features: string[];
  count: number;
}

export interface VennDiagramData {
  entities: EntityFeatureData[];
  featureIntersections: Record<string, string[]>;
  uniqueFeatures: Record<string, string[]>;
  sharedFeatures: string[];
  totalFeatures: number;
  totalUniqueFeatures: number;
  overlapPercentages: Record<string, number>;
  mostCommonFeatures: string[];
  leastCommonFeatures: string[];
}

export function processVennDiagramData(rawData: any[], selectedOEMs: string[], selectedCountry: string): VennDiagramData | null {
  if (!rawData?.length || selectedOEMs.length === 0) {
    return null;
  }

  // Filter data by country and selected OEMs
  const filteredData = rawData.filter(item => 
    item.Country === selectedCountry && 
    selectedOEMs.includes(item.OEM) &&
    item['Feature Availability']?.toString().trim().toLowerCase() === 'available'
  );

  if (filteredData.length === 0) {
    return null;
  }

  // Group features by OEM
  const oemFeatures: Record<string, string[]> = {};
  selectedOEMs.forEach(oem => {
    oemFeatures[oem] = [];
  });

  filteredData.forEach(item => {
    const oem = item.OEM;
    const feature = item['Feature Name'] || item.Feature;
    if (feature && oemFeatures[oem]) {
      oemFeatures[oem].push(feature);
    }
  });

  // Create entities data
  const entities: EntityFeatureData[] = selectedOEMs.slice(0, 3).map(oem => ({
    name: oem,
    features: [...new Set(oemFeatures[oem] || [])], // Remove duplicates
    count: new Set(oemFeatures[oem] || []).size
  }));

  // Calculate all unique features
  const allFeatures = new Set<string>();
  entities.forEach(entity => {
    entity.features.forEach(feature => allFeatures.add(feature));
  });

  // Calculate intersections
  const featureIntersections: Record<string, string[]> = {};
  const uniqueFeatures: Record<string, string[]> = {};

  // Calculate unique features for each entity
  entities.forEach(entity => {
    const otherFeatures = new Set<string>();
    entities.forEach(otherEntity => {
      if (otherEntity.name !== entity.name) {
        otherEntity.features.forEach(feature => otherFeatures.add(feature));
      }
    });
    
    uniqueFeatures[entity.name] = entity.features.filter(feature => !otherFeatures.has(feature));
  });

  // Calculate pairwise intersections
  if (entities.length >= 2) {
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entity1 = entities[i];
        const entity2 = entities[j];
        const key = `${entity1.name}-${entity2.name}`;
        
        const intersection = entity1.features.filter(feature => 
          entity2.features.includes(feature)
        );
        
        // For two-way intersection, exclude features that are in the third entity (if exists)
        if (entities.length === 3) {
          const entity3 = entities.find(e => e.name !== entity1.name && e.name !== entity2.name);
          if (entity3) {
            featureIntersections[key] = intersection.filter(feature => 
              !entity3.features.includes(feature)
            );
          }
        } else {
          featureIntersections[key] = intersection;
        }
      }
    }
  }

  // Calculate three-way intersection
  let sharedFeatures: string[] = [];
  if (entities.length === 3) {
    sharedFeatures = entities[0].features.filter(feature =>
      entities[1].features.includes(feature) && entities[2].features.includes(feature)
    );
    featureIntersections['all'] = sharedFeatures;
  } else if (entities.length === 2) {
    sharedFeatures = entities[0].features.filter(feature =>
      entities[1].features.includes(feature)
    );
  }

  // Calculate overlap percentages
  const overlapPercentages: Record<string, number> = {};
  Object.keys(featureIntersections).forEach(key => {
    const intersectionSize = featureIntersections[key].length;
    const totalUniqueFeatures = allFeatures.size;
    overlapPercentages[key] = totalUniqueFeatures > 0 ? (intersectionSize / totalUniqueFeatures) * 100 : 0;
  });

  // Find most and least common features
  const featureCounts: Record<string, number> = {};
  Array.from(allFeatures).forEach(feature => {
    featureCounts[feature] = entities.reduce((count, entity) => 
      count + (entity.features.includes(feature) ? 1 : 0), 0
    );
  });

  const sortedFeatures = Object.entries(featureCounts).sort((a, b) => b[1] - a[1]);
  const mostCommonFeatures = sortedFeatures.slice(0, 5).map(([feature]) => feature);
  const leastCommonFeatures = sortedFeatures.slice(-5).map(([feature]) => feature);

  return {
    entities,
    featureIntersections,
    uniqueFeatures,
    sharedFeatures,
    totalFeatures: allFeatures.size,
    totalUniqueFeatures: Object.values(uniqueFeatures).reduce((sum, features) => sum + features.length, 0),
    overlapPercentages,
    mostCommonFeatures,
    leastCommonFeatures
  };
}
