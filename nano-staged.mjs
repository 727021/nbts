export default {
    '*.ts': ({ filenames }) => [
        `eslint --fix ${filenames.join(' ')}`,
        `prettier --write ${filenames.join(' ')}`,
        'npm test',
        'npm run build'
    ]
}
