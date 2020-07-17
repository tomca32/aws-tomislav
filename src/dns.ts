import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import {Zone} from "@pulumi/aws/route53";

const config = new pulumi.Config();
const domainName = config.getSecret('domainName');
const keybaseVerification = config.getSecret('keybaseVerification');
const dkim = config.getSecret('dkim');
const PRIMARY_DOMAIN_NAME = 'primary-domain-name'

export function createHostedZone(): Zone {
    return new aws.route53.Zone(PRIMARY_DOMAIN_NAME, {
        name: domainName,
    });
}

export function createZoneRecords(zone: Zone): aws.route53.Record[] {
    return [
        new aws.route53.Record('fm1DomainKey', {
            name: 'fm1._domainkey',
            records: [pulumi.interpolate `fm1.${domainName}.dkim.fmhosted.com`],
            ttl: 3600,
            type: 'CNAME',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('fm2DomainKey', {
            name: 'fm2._domainkey',
            records: [pulumi.interpolate `fm2.${domainName}.dkim.fmhosted.com`],
            ttl: 3600,
            type: 'CNAME',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('fm3DomainKey', {
            name: 'fm3._domainkey',
            records: [pulumi.interpolate `fm3.${domainName}.dkim.fmhosted.com`],
            ttl: 3600,
            type: 'CNAME',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('health', {
            name: 'health',
            records: [pulumi.interpolate `health.${domainName}.herokudns.com`],
            ttl: 3600,
            type: 'CNAME',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('mail', {
            name: 'mail',
            records: ['www.fastmail.fm'],
            ttl: 3600,
            type: 'CNAME',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('snake', {
            name: 'snake',
            records: [pulumi.interpolate `snake.${domainName}.s3-website-us-east-1.amazonaws.com`],
            ttl: 3600,
            type: 'CNAME',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('mail-in', {
            name: '@',
            records: ['10 in1.smtp.messagingengine.com', '20 in2.smtp.messagingengine.com'],
            ttl: 3600,
            type: 'MX',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('txt-records', {
            name: '@',
            records: [pulumi.interpolate `keybase-site-verification=${keybaseVerification}`, 'v=spf1 include:spf.messagingengine.com ?all'],
            ttl: 3600,
            type: 'TXT',
            zoneId: zone.zoneId,
        }),
        new aws.route53.Record('domainKey', {
            name: 'mesmtp._domainkey',
            records: [pulumi.interpolate `${dkim}`],
            ttl: 3600,
            type: 'TXT',
            zoneId: zone.zoneId,
        }),
    ];
}

