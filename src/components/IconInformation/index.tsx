import { IconInformationProps } from './IconInformation.interface'

import styles from './iconInformation.module.scss'

function IconInformation({ icon: Icon, information }: IconInformationProps) {
  return (
    <h3 className={styles.information}>
      <Icon />
      {information}
    </h3>
  )
}

export { IconInformation }
