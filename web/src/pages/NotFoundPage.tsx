import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { GraduationIcon } from '@/components/ui/icons';

export function NotFoundPage() {
  return (
    <div className="container page">
      <div className="notfound">
        <span className="notfound__code">404</span>
        <h1>页面走丢了</h1>
        <p>你要找的页面不存在，或已被移动。</p>
        <Link to="/">
          <Button size="lg" leftIcon={<GraduationIcon size={18} />}>
            回到首页
          </Button>
        </Link>
      </div>
    </div>
  );
}
