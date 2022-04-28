<<<<<<< HEAD
#ifndef BOOST_SMART_PTR_DETAIL_SP_NULLPTR_T_HPP_INCLUDED
#define BOOST_SMART_PTR_DETAIL_SP_NULLPTR_T_HPP_INCLUDED

// MS compatible compilers support #pragma once

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
# pragma once
#endif

//  detail/sp_nullptr_t.hpp
//
//  Copyright 2013 Peter Dimov
//
//  Distributed under the Boost Software License, Version 1.0.
//  See accompanying file LICENSE_1_0.txt or copy at
//  http://www.boost.org/LICENSE_1_0.txt

#include <boost/config.hpp>
#include <cstddef>

#if !defined( BOOST_NO_CXX11_NULLPTR )

namespace boost
{

namespace detail
{

#if !defined( BOOST_NO_CXX11_DECLTYPE ) && ( ( defined( __clang__ ) && !defined( _LIBCPP_VERSION ) ) || defined( __INTEL_COMPILER ) )

    typedef decltype(nullptr) sp_nullptr_t;

#else

    typedef std::nullptr_t sp_nullptr_t;

#endif

} // namespace detail

} // namespace boost

#endif // !defined( BOOST_NO_CXX11_NULLPTR )

#endif  // #ifndef BOOST_SMART_PTR_DETAIL_SP_NULLPTR_T_HPP_INCLUDED
=======
#ifndef BOOST_SMART_PTR_DETAIL_SP_NULLPTR_T_HPP_INCLUDED
#define BOOST_SMART_PTR_DETAIL_SP_NULLPTR_T_HPP_INCLUDED

// MS compatible compilers support #pragma once

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
# pragma once
#endif

//  detail/sp_nullptr_t.hpp
//
//  Copyright 2013 Peter Dimov
//
//  Distributed under the Boost Software License, Version 1.0.
//  See accompanying file LICENSE_1_0.txt or copy at
//  http://www.boost.org/LICENSE_1_0.txt

#include <boost/config.hpp>
#include <cstddef>

#if !defined( BOOST_NO_CXX11_NULLPTR )

namespace boost
{

namespace detail
{

#if !defined( BOOST_NO_CXX11_DECLTYPE ) && ( ( defined( __clang__ ) && !defined( _LIBCPP_VERSION ) ) || defined( __INTEL_COMPILER ) )

    typedef decltype(nullptr) sp_nullptr_t;

#else

    typedef std::nullptr_t sp_nullptr_t;

#endif

} // namespace detail

} // namespace boost

#endif // !defined( BOOST_NO_CXX11_NULLPTR )

#endif  // #ifndef BOOST_SMART_PTR_DETAIL_SP_NULLPTR_T_HPP_INCLUDED
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
