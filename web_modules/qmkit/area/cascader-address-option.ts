import provinces from './provinces.json';
import cities from './cities.json';
import areas from './areas.json';
import streets from './streets.json';

streets.forEach(street => {
  const matchArea = areas.filter(area => area.code === street.parent_code)[0];
  if (matchArea) {
    matchArea.children = matchArea.children || [];
    matchArea.children.push({
      label: street.name,
      value: street.code
    });
  }
});


areas.forEach(area => {
  const matchCity = cities.filter(city => city.code === area.parent_code)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.code,
      children: area.children
    });
  }
});

cities.forEach(city => {
  const matchProvince = provinces.filter(
    province => province.code === city.parent_code
  )[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children
    });
  }
});

const options = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children
}));

export default options;
