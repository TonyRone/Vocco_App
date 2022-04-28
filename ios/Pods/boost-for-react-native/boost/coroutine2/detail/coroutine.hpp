<<<<<<< HEAD

//          Copyright Oliver Kowalke 2014.
// Distributed under the Boost Software License, Version 1.0.
//    (See accompanying file LICENSE_1_0.txt or copy at
//          http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_COROUTINES2_DETAIL_COROUTINE_HPP
#define BOOST_COROUTINES2_DETAIL_COROUTINE_HPP

#include <boost/config.hpp>
#include <boost/context/detail/config.hpp>

#ifdef BOOST_HAS_ABI_HEADERS
#  include BOOST_ABI_PREFIX
#endif

namespace boost {
namespace coroutines2 {
namespace detail {

template< typename T >
class pull_coroutine;

template< typename T >
class push_coroutine;

}}}

#include <boost/coroutine2/detail/pull_coroutine.hpp>
#include <boost/coroutine2/detail/push_coroutine.hpp>

#if defined(BOOST_EXECUTION_CONTEXT)
# if (BOOST_EXECUTION_CONTEXT==1)
#  include <boost/coroutine2/detail/pull_control_block_ecv1.hpp>
#  include <boost/coroutine2/detail/push_control_block_ecv1.hpp>
# else
#  include <boost/coroutine2/detail/pull_control_block_ecv2.hpp>
#  include <boost/coroutine2/detail/push_control_block_ecv2.hpp>
# endif

# include <boost/coroutine2/detail/pull_coroutine.ipp>
# include <boost/coroutine2/detail/push_coroutine.ipp>

# if (BOOST_EXECUTION_CONTEXT==1)
#  include <boost/coroutine2/detail/pull_control_block_ecv1.ipp>
#  include <boost/coroutine2/detail/push_control_block_ecv1.ipp>
# else
#  include <boost/coroutine2/detail/pull_control_block_ecv2.ipp>
#  include <boost/coroutine2/detail/push_control_block_ecv2.ipp>
# endif
#endif

#ifdef BOOST_HAS_ABI_HEADERS
#  include BOOST_ABI_SUFFIX
#endif

#endif // BOOST_COROUTINES2_DETAIL_COROUTINE_HPP
=======

//          Copyright Oliver Kowalke 2014.
// Distributed under the Boost Software License, Version 1.0.
//    (See accompanying file LICENSE_1_0.txt or copy at
//          http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_COROUTINES2_DETAIL_COROUTINE_HPP
#define BOOST_COROUTINES2_DETAIL_COROUTINE_HPP

#include <boost/config.hpp>
#include <boost/context/detail/config.hpp>

#ifdef BOOST_HAS_ABI_HEADERS
#  include BOOST_ABI_PREFIX
#endif

namespace boost {
namespace coroutines2 {
namespace detail {

template< typename T >
class pull_coroutine;

template< typename T >
class push_coroutine;

}}}

#include <boost/coroutine2/detail/pull_coroutine.hpp>
#include <boost/coroutine2/detail/push_coroutine.hpp>

#if defined(BOOST_EXECUTION_CONTEXT)
# if (BOOST_EXECUTION_CONTEXT==1)
#  include <boost/coroutine2/detail/pull_control_block_ecv1.hpp>
#  include <boost/coroutine2/detail/push_control_block_ecv1.hpp>
# else
#  include <boost/coroutine2/detail/pull_control_block_ecv2.hpp>
#  include <boost/coroutine2/detail/push_control_block_ecv2.hpp>
# endif

# include <boost/coroutine2/detail/pull_coroutine.ipp>
# include <boost/coroutine2/detail/push_coroutine.ipp>

# if (BOOST_EXECUTION_CONTEXT==1)
#  include <boost/coroutine2/detail/pull_control_block_ecv1.ipp>
#  include <boost/coroutine2/detail/push_control_block_ecv1.ipp>
# else
#  include <boost/coroutine2/detail/pull_control_block_ecv2.ipp>
#  include <boost/coroutine2/detail/push_control_block_ecv2.ipp>
# endif
#endif

#ifdef BOOST_HAS_ABI_HEADERS
#  include BOOST_ABI_SUFFIX
#endif

#endif // BOOST_COROUTINES2_DETAIL_COROUTINE_HPP
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
