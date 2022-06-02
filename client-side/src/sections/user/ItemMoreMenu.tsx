import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

interface PropType {
  iconURI?: string,
  items: {
    iconURI: string,
    label: string,
    onClick?: (data?: any)=>void,
  }[],
  data?: any,
}

export default function ItemMoreMenu(props: PropType) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const iconURI = props.iconURI ? props.iconURI : "eva:more-vertical-fill";

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon={iconURI} width={20} height={20} sx={undefined} />
      </IconButton>

      {ref && <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {props.items.map(i => {
          return (
            <MenuItem
              key={i.label}
              onClick={() => {
                if(i.onClick){
                  i.onClick(props.data)
                }
              }}
              sx={{ color: 'text.secondary' }}
            >
              <ListItemIcon>
                <Iconify icon={i.iconURI} width={24} height={24} sx={undefined} />
              </ListItemIcon>
              <ListItemText primary={i.label} primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          )
        })}
      </Menu>}
    </>
  );
}
