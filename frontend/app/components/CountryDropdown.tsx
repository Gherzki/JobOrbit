import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react/jsx-runtime';

const countries = [
  { href: '/us', label: 'United States'},
  { href: '/ca', label: 'Canada'},
]

function CountryDropdown() {
  return (
    // main dropdown component
    <Menu>
      <MenuButton as="button"> Countries </MenuButton>
      <MenuItems anchor="bottom" as="section">
        {countries.map((countries) => (
          <MenuItem key={countries.href} as={Fragment}>
            {({ focus }) => (
              <a className={clsx('block', focus && 'bg-blue-100')} href={countries.href}>
                {countries.label}
              </a>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>

  );
}

export default CountryDropdown;


 