<<<<<<< HEAD

#ifndef BOOST_MPL_REVERSE_HPP_INCLUDED
#define BOOST_MPL_REVERSE_HPP_INCLUDED

// Copyright Aleksey Gurtovoy 2000-2004
//
// Distributed under the Boost Software License, Version 1.0. 
// (See accompanying file LICENSE_1_0.txt or copy at 
// http://www.boost.org/LICENSE_1_0.txt)
//
// See http://www.boost.org/libs/mpl for documentation.

// $Id$
// $Date$
// $Revision$

#include <boost/mpl/copy.hpp>
#include <boost/mpl/aux_/na_spec.hpp>

namespace boost { namespace mpl {

template<
      typename BOOST_MPL_AUX_NA_PARAM(Sequence)
    , typename BOOST_MPL_AUX_NA_PARAM(Inserter)
    >
struct reverse
    : reverse_copy<
          Sequence
        , Inserter
        >
{
};

BOOST_MPL_AUX_NA_SPEC(1, reverse)

}}

#endif // BOOST_MPL_REVERSE_HPP_INCLUDED
=======

#ifndef BOOST_MPL_REVERSE_HPP_INCLUDED
#define BOOST_MPL_REVERSE_HPP_INCLUDED

// Copyright Aleksey Gurtovoy 2000-2004
//
// Distributed under the Boost Software License, Version 1.0. 
// (See accompanying file LICENSE_1_0.txt or copy at 
// http://www.boost.org/LICENSE_1_0.txt)
//
// See http://www.boost.org/libs/mpl for documentation.

// $Id$
// $Date$
// $Revision$

#include <boost/mpl/copy.hpp>
#include <boost/mpl/aux_/na_spec.hpp>

namespace boost { namespace mpl {

template<
      typename BOOST_MPL_AUX_NA_PARAM(Sequence)
    , typename BOOST_MPL_AUX_NA_PARAM(Inserter)
    >
struct reverse
    : reverse_copy<
          Sequence
        , Inserter
        >
{
};

BOOST_MPL_AUX_NA_SPEC(1, reverse)

}}

#endif // BOOST_MPL_REVERSE_HPP_INCLUDED
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
