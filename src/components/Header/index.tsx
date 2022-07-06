import Image from 'next/image'
import Link from 'next/link'

import styles from './header.module.scss'
import commonStyles from '../../styles/common.module.scss'

export default function Header() {
  return (
    <header className={`${styles.headerContainer} ${commonStyles.container}`}>
      <Link href="/">
        <a>
          <Image
            width={238}
            height={25}
            src="/images/logo.svg"
            alt="Logo spacetraveling"
          />
        </a>
      </Link>
    </header>
  )
}
