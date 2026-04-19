import React from 'react';
import { FaHome, FaMapMarkedAlt, FaBuilding } from 'react-icons/fa';
import { useHomePageBoxes, useDynamicBoxes } from '../../hooks/useHomePageBoxes';
import CategoryCard from './CategoryCard';
import { CategoryCardSkeleton } from '../Common/Skeleton';
import './BrowseProperties.css';

const BrowseProperties = ({ listingType, city }) => {
  const { boxes = [], isLoading: isReduxLoading, isError: isReduxError, error } = useHomePageBoxes();
  const message = error?.message;

  // Use React Query for dynamic boxes
  const { data: dynamicData, isLoading: loadingDynamic } = useDynamicBoxes(city);

  const isLoading = isReduxLoading || loadingDynamic;
  const isError = isReduxError;

  // Transform box data (Legacy/Static) - Used as fallback or initial structure
  const getBoxData = (key) => {
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
          const pluralType = type === 'House' ? 'Houses' : type === 'Flat' ? 'Flats' : type === 'Plot' ? 'Plots' : type === 'Shop' ? 'Shops' : type === 'Office' ? 'Offices' : type;
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

  const staticHomeData = getBoxData('homes');
  const staticPlotsData = getBoxData('plots');
  const staticCommercialData = getBoxData('commercial');

  // Merge Dynamic Data: Override specific tabs if dynamic data exists
  // now expects 'dynamicMixin' to be the specific category object (e.g. dynamicData.homes)
  const mergeDynamic = (staticData, dynamicMixin) => {
    if (!dynamicMixin) return staticData;

    const newData = { ...staticData };
    if (dynamicMixin.popular && dynamicMixin.popular.length > 0) newData['Popular'] = dynamicMixin.popular;
    if (dynamicMixin.types && dynamicMixin.types.length > 0) newData['Type'] = dynamicMixin.types;
    if (dynamicMixin.areas && dynamicMixin.areas.length > 0) newData['Area Size'] = dynamicMixin.areas;

    return newData;
  };

  const homeData = mergeDynamic(staticHomeData, dynamicData?.homes);
  const plotsData = mergeDynamic(staticPlotsData, dynamicData?.plots);
  const commercialData = mergeDynamic(staticCommercialData, dynamicData?.commercial);

  if (isLoading || loadingDynamic) {
    return (
      <div className="browse-section py-5 bg-light">
        <div className="container">
          <h2 className="section-title mb-4 fw-bold">Browse Properties</h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6"><CategoryCardSkeleton /></div>
            <div className="col-lg-4 col-md-6"><CategoryCardSkeleton /></div>
            <div className="col-lg-4 col-md-6"><CategoryCardSkeleton /></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-5 text-danger">Error: {message}</div>;
  }

  return (
    <div className="browse-section py-5 bg-light">
      <div className="container">
        <h2 className="section-title mb-4 fw-bold">Browse Properties</h2>
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <CategoryCard
              icon={FaHome}
              title="Homes"
              categories={homeData}
              city={city}
            />
          </div>
          {listingType !== 'RENT' && (
            <div className="col-lg-4 col-md-6">
              <CategoryCard
                icon={FaMapMarkedAlt}
                title="Plots"
                categories={plotsData}
                city={city}
              />
            </div>
          )}
          <div className="col-lg-4 col-md-6">
            <CategoryCard
              icon={FaBuilding}
              title="Commercial"
              categories={commercialData}
              city={city}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseProperties;
