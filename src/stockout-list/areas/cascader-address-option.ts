import provinces from './provinces.json';
import cities from './cities.json';

cities.forEach((city) => {
  const matchProvince = provinces.filter(
    (province) => province.code === city.parent_code
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

const options = provinces.map((province) => ({
  label: province.name,
  value: province.code,
  children: province.children
}));

export default options;
