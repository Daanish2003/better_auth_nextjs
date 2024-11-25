import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface CardWrapperType {
    children: React.ReactNode,
    cardTitle: string,
    cardDescription: string
}

const CardWrapper = ({
    children,
    cardTitle,
    cardDescription,
}: CardWrapperType) => {
    return (
        <Card className="w-[400px] relative">
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
         </Card>
    )
}

export default CardWrapper