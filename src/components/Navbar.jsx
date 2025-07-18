import React from 'react';
import { Box, Container, HStack, Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/auth', label: 'Auth' },
    { path: '/rewards', label: 'Rewards' },
    { path: '/campaigns', label: 'Campaigns' },
    { path: '/campaign-insights', label: 'Insights' },
    { path: '/campaign-analytics', label: 'Analytics' },
    { path: '/auctions', label: 'Auctions' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/profile', label: 'Profile' },
    { path: '/receipt-upload', label: 'Receipt Upload' },
    { path: '/checkout', label: 'Checkout' },
  ];

  return (
    <Box bg="teal.500" py={4} position="sticky" top={0} zIndex={1000}>
      <Container maxW="container.xl">
        <HStack spacing={4} justify="center">
          {navItems.map((item) => (
            <Button
              key={item.path}
              as={Link}
              to={item.path}
              variant="ghost"
              color="white"
              _hover={{ bg: 'teal.600' }}
              _active={{ bg: 'teal.700' }}
              isActive={location.pathname === item.path}
              fontSize="sm"
            >
              {item.label}
            </Button>
          ))}
        </HStack>
      </Container>
    </Box>
  );
};

export default Navbar;