<<<<<<< HEAD
/*==============================================================================
    Copyright (c) 2001-2010 Joel de Guzman
    Copyright (c) 2004 Daniel Wallin
    Copyright (c) 2010 Thomas Heller

    Distributed under the Boost Software License, Version 1.0. (See accompanying
    file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
==============================================================================*/
                template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 1 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) ; } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 2 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 3 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 4 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 5 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 6 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 7 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 8 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 9 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 10 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 11 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 12 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 13 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 14 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 15 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 16 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 17 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 18 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ) && function_equal_()( proto::child_c< 17 >(e1) , proto::child_c< 17 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 19 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ) && function_equal_()( proto::child_c< 17 >(e1) , proto::child_c< 17 >(e2) ) && function_equal_()( proto::child_c< 18 >(e1) , proto::child_c< 18 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 20 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ) && function_equal_()( proto::child_c< 17 >(e1) , proto::child_c< 17 >(e2) ) && function_equal_()( proto::child_c< 18 >(e1) , proto::child_c< 18 >(e2) ) && function_equal_()( proto::child_c< 19 >(e1) , proto::child_c< 19 >(e2) ); }
=======
/*==============================================================================
    Copyright (c) 2001-2010 Joel de Guzman
    Copyright (c) 2004 Daniel Wallin
    Copyright (c) 2010 Thomas Heller

    Distributed under the Boost Software License, Version 1.0. (See accompanying
    file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
==============================================================================*/
                template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 1 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) ; } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 2 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 3 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 4 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 5 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 6 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 7 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 8 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 9 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 10 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 11 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 12 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 13 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 14 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 15 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 16 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 17 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 18 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ) && function_equal_()( proto::child_c< 17 >(e1) , proto::child_c< 17 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 19 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ) && function_equal_()( proto::child_c< 17 >(e1) , proto::child_c< 17 >(e2) ) && function_equal_()( proto::child_c< 18 >(e1) , proto::child_c< 18 >(e2) ); } template <typename Expr1> result_type evaluate( Expr1 const& e1 , Expr1 const& e2 , mpl::long_< 20 > ) const { return function_equal_()( proto::child_c<0>(e1) , proto::child_c<0>(e2) ) && function_equal_()( proto::child_c< 1 >(e1) , proto::child_c< 1 >(e2) ) && function_equal_()( proto::child_c< 2 >(e1) , proto::child_c< 2 >(e2) ) && function_equal_()( proto::child_c< 3 >(e1) , proto::child_c< 3 >(e2) ) && function_equal_()( proto::child_c< 4 >(e1) , proto::child_c< 4 >(e2) ) && function_equal_()( proto::child_c< 5 >(e1) , proto::child_c< 5 >(e2) ) && function_equal_()( proto::child_c< 6 >(e1) , proto::child_c< 6 >(e2) ) && function_equal_()( proto::child_c< 7 >(e1) , proto::child_c< 7 >(e2) ) && function_equal_()( proto::child_c< 8 >(e1) , proto::child_c< 8 >(e2) ) && function_equal_()( proto::child_c< 9 >(e1) , proto::child_c< 9 >(e2) ) && function_equal_()( proto::child_c< 10 >(e1) , proto::child_c< 10 >(e2) ) && function_equal_()( proto::child_c< 11 >(e1) , proto::child_c< 11 >(e2) ) && function_equal_()( proto::child_c< 12 >(e1) , proto::child_c< 12 >(e2) ) && function_equal_()( proto::child_c< 13 >(e1) , proto::child_c< 13 >(e2) ) && function_equal_()( proto::child_c< 14 >(e1) , proto::child_c< 14 >(e2) ) && function_equal_()( proto::child_c< 15 >(e1) , proto::child_c< 15 >(e2) ) && function_equal_()( proto::child_c< 16 >(e1) , proto::child_c< 16 >(e2) ) && function_equal_()( proto::child_c< 17 >(e1) , proto::child_c< 17 >(e2) ) && function_equal_()( proto::child_c< 18 >(e1) , proto::child_c< 18 >(e2) ) && function_equal_()( proto::child_c< 19 >(e1) , proto::child_c< 19 >(e2) ); }
>>>>>>> 5ae3c2e28cc85ece3f79eae8300dd539bc803798
