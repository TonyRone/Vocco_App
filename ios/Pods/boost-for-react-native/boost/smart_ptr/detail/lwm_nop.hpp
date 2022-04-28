<<<<<<< HEAD
#ifndef BOOST_SMART_PTR_DETAIL_LWM_NOP_HPP_INCLUDED
#define BOOST_SMART_PTR_DETAIL_LWM_NOP_HPP_INCLUDED

// MS compatible compilers support #pragma once

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
# pragma once
#endif

//
//  boost/detail/lwm_nop.hpp
//
//  Copyright (c) 2002 Peter Dimov and Multi Media Ltd.
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)
//

namespace boost
{

namespace detail
{

class lightweight_mutex
{
public:

    typedef lightweight_mutex scoped_lock;
};

} // namespace detail

} // namespace boost

#endif // #ifndef BOOST_SMART_PTR_DETAIL_LWM_NOP_HPP_INCLUDED
=======
#ifndef BOOST_SMART_PTR_DETAIL_LWM_NOP_HPP_INCLUDED
#define BOOST_SMART_PTR_DETAIL_LWM_NOP_HPP_INCLUDED

// MS compatible compilers support #pragma once

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
# pragma once
#endif

//
//  boost/detail/lwm_nop.hpp
//
//  Copyright (c) 2002 Peter Dimov and Multi Media Ltd.
//
// Distributed under the Boost Software License, Version 1.0. (See
// accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)
//

namespace boost
{

namespace detail
{

class lightweight_mutex
{
public:

    typedef lightweight_mutex scoped_lock;
};

} // namespace detail

} // namespace boost

#endif // #ifndef BOOST_SMART_PTR_DETAIL_LWM_NOP_HPP_INCLUDED
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
