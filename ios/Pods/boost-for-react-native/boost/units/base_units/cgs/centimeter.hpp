<<<<<<< HEAD
// Boost.Units - A C++ library for zero-overhead dimensional analysis and 
// unit/quantity manipulation and conversion
//
// Copyright (C) 2003-2008 Matthias Christian Schabel
// Copyright (C) 2007-2008 Steven Watanabe
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_UNITS_CENTIMETER_BASE_UNIT_HPP
#define BOOST_UNITS_CENTIMETER_BASE_UNIT_HPP

#include <boost/units/scaled_base_unit.hpp>
#include <boost/units/base_units/si/meter.hpp>

namespace boost {

namespace units {

namespace cgs {

typedef scaled_base_unit<boost::units::si::meter_base_unit, scale<10, static_rational<-2> > > centimeter_base_unit;

} // namespace cgs

} // namespace units

} // namespace boost

#endif // BOOST_UNITS_CENTIMETER_BASE_UNIT_HPP
=======
// Boost.Units - A C++ library for zero-overhead dimensional analysis and 
// unit/quantity manipulation and conversion
//
// Copyright (C) 2003-2008 Matthias Christian Schabel
// Copyright (C) 2007-2008 Steven Watanabe
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_UNITS_CENTIMETER_BASE_UNIT_HPP
#define BOOST_UNITS_CENTIMETER_BASE_UNIT_HPP

#include <boost/units/scaled_base_unit.hpp>
#include <boost/units/base_units/si/meter.hpp>

namespace boost {

namespace units {

namespace cgs {

typedef scaled_base_unit<boost::units::si::meter_base_unit, scale<10, static_rational<-2> > > centimeter_base_unit;

} // namespace cgs

} // namespace units

} // namespace boost

#endif // BOOST_UNITS_CENTIMETER_BASE_UNIT_HPP
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
