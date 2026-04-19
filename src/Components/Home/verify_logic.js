// Mock Data mimicking the verify_homepage_data.js findings
const mockBoxes = [
    {
        boxKey: 'homes',
        title: 'Popular',
        isActive: true,
        order: 1,
        sections: [
            {
                sectionTitle: 'Popular', // User might have named section same as box or generic
                items: [{ title: '5 Marla House', query: { propertyType: 'House' } }]
            }
        ]
    },
    {
        boxKey: 'homes',
        title: 'Type',
        isActive: true,
        order: 2,
        sections: [
            {
                sectionTitle: 'Houses',
                items: [{ title: 'Houses', query: { propertyType: 'House' } }]
            },
            {
                sectionTitle: 'Flats',
                items: [{ title: 'Flats', query: { propertyType: 'Flat' } }]
            }
        ]
    },
    {
        boxKey: 'homes',
        title: 'Area Size',
        isActive: true,
        order: 3,
        sections: [
            {
                sectionTitle: '5 Marla',
                items: [{ title: '5 Marla', query: { propertyType: 'House', areaSize: 5, areaUnit: 'Marla' } }]
            }
        ]
    }
];

const getBoxData = (key, boxes) => {
    const matchingBoxes = boxes.filter((b) => b.boxKey === key && b.isActive);
    if (!matchingBoxes.length) return {};

    const categories = {};

    const addToCategory = (categoryName, setItems) => {
        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }

        const items = setItems.map((item) => {
            let subtitle = '';
            if (item.query) {
                const type = item.query.propertyType || '';
                const pluralType = type === 'House' ? 'Houses' : type === 'Flat' ? 'Flats' : type;
                subtitle = pluralType;
            }
            return {
                title: item.title,
                subtitle: subtitle,
                query: item.query
            };
        });

        categories[categoryName] = [...categories[categoryName], ...items];
    };

    matchingBoxes.forEach((box) => {
        const isMainTab = ['Popular', 'Type', 'Area Size'].includes(box.title);

        if (isMainTab) {
            box.sections.forEach((section) => {
                addToCategory(box.title, section.items);
            });
        } else {
            box.sections.forEach((section) => {
                addToCategory(section.sectionTitle, section.items);
            });
        }
    });

    return categories;
};

const result = getBoxData('homes', mockBoxes);

// Only log in development
if (import.meta.env.DEV) {
    

    // Checks
    const keys = Object.keys(result);
    if (keys.includes('Popular') && keys.includes('Type') && keys.includes('Area Size')) {
        
    } else {
        
    }
}
