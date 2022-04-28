<<<<<<< HEAD
//  access_rights.hpp  --------------------------------------------------------------//

//  Copyright 2016 Andrey Semashev

//  Distributed under the Boost Software License, Version 1.0.
//  See http://www.boost.org/LICENSE_1_0.txt


#ifndef BOOST_DETAIL_WINAPI_ACCESS_RIGHTS_HPP
#define BOOST_DETAIL_WINAPI_ACCESS_RIGHTS_HPP

#include <boost/detail/winapi/basic_types.hpp>

#ifdef BOOST_HAS_PRAGMA_ONCE
#pragma once
#endif

namespace boost {
namespace detail {
namespace winapi {

#if defined( BOOST_USE_WINDOWS_H )

const DWORD_ DELETE_ = DELETE;
const DWORD_ READ_CONTROL_ = READ_CONTROL;
const DWORD_ WRITE_DAC_ = WRITE_DAC;
const DWORD_ WRITE_OWNER_ = WRITE_OWNER;
const DWORD_ SYNCHRONIZE_ = SYNCHRONIZE;

const DWORD_ STANDARD_RIGHTS_ALL_ = STANDARD_RIGHTS_ALL;
const DWORD_ STANDARD_RIGHTS_EXECUTE_ = STANDARD_RIGHTS_EXECUTE;
const DWORD_ STANDARD_RIGHTS_READ_ = STANDARD_RIGHTS_READ;
const DWORD_ STANDARD_RIGHTS_REQUIRED_ = STANDARD_RIGHTS_REQUIRED;
const DWORD_ STANDARD_RIGHTS_WRITE_ = STANDARD_RIGHTS_WRITE;

const DWORD_ SPECIFIC_RIGHTS_ALL_ = SPECIFIC_RIGHTS_ALL;

const DWORD_ ACCESS_SYSTEM_SECURITY_ = ACCESS_SYSTEM_SECURITY;

const DWORD_ MAXIMUM_ALLOWED_ = MAXIMUM_ALLOWED;

const DWORD_ GENERIC_ALL_ = GENERIC_ALL;
const DWORD_ GENERIC_EXECUTE_ = GENERIC_EXECUTE;
const DWORD_ GENERIC_WRITE_ = GENERIC_WRITE;
const DWORD_ GENERIC_READ_ = GENERIC_READ;

typedef ::ACCESS_MASK ACCESS_MASK_;
typedef ::PACCESS_MASK PACCESS_MASK_;

#else // defined( BOOST_USE_WINDOWS_H )

const DWORD_ DELETE_ = 0x00010000;
const DWORD_ READ_CONTROL_ = 0x00020000;
const DWORD_ WRITE_DAC_ = 0x00040000;
const DWORD_ WRITE_OWNER_ = 0x00080000;
const DWORD_ SYNCHRONIZE_ = 0x00100000;

const DWORD_ STANDARD_RIGHTS_ALL_ = 0x001F0000;
const DWORD_ STANDARD_RIGHTS_EXECUTE_ = READ_CONTROL_;
const DWORD_ STANDARD_RIGHTS_READ_ = READ_CONTROL_;
const DWORD_ STANDARD_RIGHTS_REQUIRED_ = 0x000F0000;
const DWORD_ STANDARD_RIGHTS_WRITE_ = READ_CONTROL_;

const DWORD_ SPECIFIC_RIGHTS_ALL_ = 0x0000FFFF;

const DWORD_ ACCESS_SYSTEM_SECURITY_ = 0x01000000;

const DWORD_ MAXIMUM_ALLOWED_ = 0x02000000;

const DWORD_ GENERIC_ALL_ = 0x10000000;
const DWORD_ GENERIC_EXECUTE_ = 0x20000000;
const DWORD_ GENERIC_WRITE_ = 0x40000000;
const DWORD_ GENERIC_READ_ = 0x80000000;

typedef DWORD_ ACCESS_MASK_;
typedef ACCESS_MASK_* PACCESS_MASK_;

#endif // defined( BOOST_USE_WINDOWS_H )

}
}
}

#endif // BOOST_DETAIL_WINAPI_ACCESS_RIGHTS_HPP
=======
//  access_rights.hpp  --------------------------------------------------------------//

//  Copyright 2016 Andrey Semashev

//  Distributed under the Boost Software License, Version 1.0.
//  See http://www.boost.org/LICENSE_1_0.txt


#ifndef BOOST_DETAIL_WINAPI_ACCESS_RIGHTS_HPP
#define BOOST_DETAIL_WINAPI_ACCESS_RIGHTS_HPP

#include <boost/detail/winapi/basic_types.hpp>

#ifdef BOOST_HAS_PRAGMA_ONCE
#pragma once
#endif

namespace boost {
namespace detail {
namespace winapi {

#if defined( BOOST_USE_WINDOWS_H )

const DWORD_ DELETE_ = DELETE;
const DWORD_ READ_CONTROL_ = READ_CONTROL;
const DWORD_ WRITE_DAC_ = WRITE_DAC;
const DWORD_ WRITE_OWNER_ = WRITE_OWNER;
const DWORD_ SYNCHRONIZE_ = SYNCHRONIZE;

const DWORD_ STANDARD_RIGHTS_ALL_ = STANDARD_RIGHTS_ALL;
const DWORD_ STANDARD_RIGHTS_EXECUTE_ = STANDARD_RIGHTS_EXECUTE;
const DWORD_ STANDARD_RIGHTS_READ_ = STANDARD_RIGHTS_READ;
const DWORD_ STANDARD_RIGHTS_REQUIRED_ = STANDARD_RIGHTS_REQUIRED;
const DWORD_ STANDARD_RIGHTS_WRITE_ = STANDARD_RIGHTS_WRITE;

const DWORD_ SPECIFIC_RIGHTS_ALL_ = SPECIFIC_RIGHTS_ALL;

const DWORD_ ACCESS_SYSTEM_SECURITY_ = ACCESS_SYSTEM_SECURITY;

const DWORD_ MAXIMUM_ALLOWED_ = MAXIMUM_ALLOWED;

const DWORD_ GENERIC_ALL_ = GENERIC_ALL;
const DWORD_ GENERIC_EXECUTE_ = GENERIC_EXECUTE;
const DWORD_ GENERIC_WRITE_ = GENERIC_WRITE;
const DWORD_ GENERIC_READ_ = GENERIC_READ;

typedef ::ACCESS_MASK ACCESS_MASK_;
typedef ::PACCESS_MASK PACCESS_MASK_;

#else // defined( BOOST_USE_WINDOWS_H )

const DWORD_ DELETE_ = 0x00010000;
const DWORD_ READ_CONTROL_ = 0x00020000;
const DWORD_ WRITE_DAC_ = 0x00040000;
const DWORD_ WRITE_OWNER_ = 0x00080000;
const DWORD_ SYNCHRONIZE_ = 0x00100000;

const DWORD_ STANDARD_RIGHTS_ALL_ = 0x001F0000;
const DWORD_ STANDARD_RIGHTS_EXECUTE_ = READ_CONTROL_;
const DWORD_ STANDARD_RIGHTS_READ_ = READ_CONTROL_;
const DWORD_ STANDARD_RIGHTS_REQUIRED_ = 0x000F0000;
const DWORD_ STANDARD_RIGHTS_WRITE_ = READ_CONTROL_;

const DWORD_ SPECIFIC_RIGHTS_ALL_ = 0x0000FFFF;

const DWORD_ ACCESS_SYSTEM_SECURITY_ = 0x01000000;

const DWORD_ MAXIMUM_ALLOWED_ = 0x02000000;

const DWORD_ GENERIC_ALL_ = 0x10000000;
const DWORD_ GENERIC_EXECUTE_ = 0x20000000;
const DWORD_ GENERIC_WRITE_ = 0x40000000;
const DWORD_ GENERIC_READ_ = 0x80000000;

typedef DWORD_ ACCESS_MASK_;
typedef ACCESS_MASK_* PACCESS_MASK_;

#endif // defined( BOOST_USE_WINDOWS_H )

}
}
}

#endif // BOOST_DETAIL_WINAPI_ACCESS_RIGHTS_HPP
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
