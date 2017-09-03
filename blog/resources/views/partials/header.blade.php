<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <a href="#" class="navbar-brand">Laravel Guide</a>
            <ul class="nav navbar-nav">
                <li><a href="{{route('blog.index')}}">Blog</a></li>
                <li><a href="{{route('other.about')}}">About</a></li>
                @if (!Auth::check())
                    <li><a href="{{url('/login')}}">Login</a></li>
                    <li><a href="{{url('/register')}}">Register</a></li>
                @endif
                @if (Auth::check())
                    <li ><a href="{{ route('admin.index') }}">Posts</a></li>
                    <li>
                      <a href="{{ route('logout') }}"
                          onclick="event.preventDefault();
                                   document.getElementById('logout-form').submit();">
                          Logout
                      </a>

                      <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                          {{ csrf_field() }}
                      </form>
                    </li>
                @endif


            </ul>
        </div>
    </div>
</nav>
